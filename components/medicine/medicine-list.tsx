import { View, ActivityIndicator, TouchableOpacity, Alert, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import MedicineItem from '@/components/medicine/medicine-item';
import EmptyState from '@/components/empty-state';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function MedicineList() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, 'medications'), where('user', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMedicines(meds);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const docRef = doc(db, 'medications', id);
      await deleteDoc(docRef);
      setMedicines((prev) => prev.filter((med) => med.id !== id)); // Remove the deleted item from state
      Alert.alert('Success', 'Medicine deleted successfully');
    } catch (error) {
      console.error('Error deleting medication: ', error);
      Alert.alert('Error', 'Failed to delete medicine');
    }
  };

  if (loading) return <ActivityIndicator size="large" className="mt-20" />;
  if (medicines.length === 0) return <EmptyState />;

  return (
    <View className="mt-4">
      {medicines.map((med) => (
        <View key={med.id}>
          <MedicineItem
            id={med.id} // Pass id prop
            name={med.name}
            dose={med.dose}
            times={med.times}
            onPress={() => router.push({ pathname: '/(root)/medicine-detail', params: { id: med.id } })}
            onDelete={handleDelete} // Pass onDelete prop
          />
        </View>
      ))}
    </View>
  );
}
