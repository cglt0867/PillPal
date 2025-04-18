import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MedicineList from '@/components/medicine/medicine-list';
import { useEffect, useState, useRef } from 'react';
import { collection, query, where, serverTimestamp, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { getAuth } from '@firebase/auth';
import { onSnapshot } from 'firebase/firestore';
import ReminderModal from '@/components/intake-confirm';

export default function Home() {
  const router = useRouter();
  const [medications, setMedications] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [medsToTake, setMedsToTake] = useState<any[]>([]);

  const lastTriggeredRef = useRef<{ medIds: string[]; time: string } | null>(null);


  //--------------------------------------
  //--Getting Medications from Firestore--
  //--------------------------------------
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const medsRef = collection(db, 'medications');
    const q = query(medsRef, where('user', '==', user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const meds: any[] = [];
      querySnapshot.forEach((doc) => {
        meds.push({ id: doc.id, ...doc.data() });
      });
      setMedications(meds);
    });

    return () => unsubscribe();
  }, []);

  //----------------------------------------------------
  //-- Aligning the interval to the top of the minute---
  //----------------------------------------------------
  useEffect(() => {
    const startAlignedInterval = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      // Wait until the top of the next minute
      const timeToNextMinute = (60 - seconds) * 1000 - milliseconds;

      const timeout = setTimeout(() => {
        // Run immediately at top of minute
        checkMedTime();

        // Then run every 60 seconds
        const interval = setInterval(() => {
          checkMedTime();
        }, 60000);

        // Clear interval on unmount
        return () => clearInterval(interval);
      }, timeToNextMinute);

      return () => clearTimeout(timeout);
    };

    //-----------------------------------------------------
    //--Function to check if it's time for any medication--
    //-----------------------------------------------------
    const checkMedTime = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
      // Get all meds due now
      const dueMeds = medications.filter(
        (med) => Array.isArray(med.times) && med.times.includes(currentTime)
      );
    
      // If there's nothing due, return early
      if (dueMeds.length === 0) return;
    
      const dueMedIds = dueMeds.map((med) => med.id).sort(); // sort to compare accurately
    
      const alreadyTriggered =
        lastTriggeredRef.current?.time === currentTime &&
        JSON.stringify(lastTriggeredRef.current?.medIds) === JSON.stringify(dueMedIds);
    
      if (!alreadyTriggered) {
        lastTriggeredRef.current = { medIds: dueMedIds, time: currentTime };
        setMedsToTake(dueMeds);
        setShowModal(true);
        console.log(`🔔 Time for meds at ${currentTime}:`, dueMeds.map((m) => m.name).join(', '));
      }
    };
    

    const cleanup = startAlignedInterval();

    return cleanup;
  }, [medications]);

  //-----------------------------------------------------
  //--Function to log medication history to Firestore--
  //-----------------------------------------------------

  const logMedicationHistory = async (medicineName: string, status: 'taken' | 'skipped') => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        console.warn('User not authenticated');
        return;
      }

      await addDoc(collection(db, 'medicationHistory'), {
        userId: user.uid,
        medicineName,
        timeTaken: serverTimestamp(),
        status,
      });

      console.log(`📘 Logged history for ${medicineName}: ${status}`);
    } catch (error) {
      console.error('❌ Failed to log medication history:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Text className="text-2xl font-bold mb-4 text-center pt-5">My Medications</Text>

      <MedicineList />
      {/* ➕ Add Medication Button */}
      <TouchableOpacity
        onPress={() => router.push('/add-new-med')}
        className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg"
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <ReminderModal
        visible={showModal}
        meds={medsToTake}
        onClose={() => setShowModal(false)} // Close button in modal handles this
        onConfirm={(med) => {
          logMedicationHistory(med.name, 'taken');
        }}
        onSkip={(med) => {
          logMedicationHistory(med.name, 'skipped');
        }}
      />


    </View>
  );
}
