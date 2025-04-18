import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { db } from '@/config/firebaseConfig'; // adjust path as needed
import { addDoc, collection } from 'firebase/firestore';
import { useAuth } from '@/context/authContext';
import { router } from 'expo-router';
import SubHeader from '@/components/subheader';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatTo24Hour = (date: Date) => {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

type MedFormData = {
  user: string;
  name: string;
  dose: string;
  container: number | null;
  times: string[];
};

export default function AddMedForm() {
  const { fireuser } = useAuth();  // Assuming the useAuth hook provides the current user
  const [formData, setFormData] = useState<MedFormData>({
    user: fireuser?.uid || '',  // Ensure to use the correct user ID
    name: '',
    dose: '',
    container: null,
    times: [],
  });

  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  // Update formData user whenever user info changes
  useEffect(() => {
    if (fireuser) {
      setFormData((prev) => ({ ...prev, user: fireuser.uid }));
    }
  }, [fireuser]);

  const handleInputChange = (field: keyof MedFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };



  const handleConfirmTime = (date: Date) => {
    const time12hr = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  
    const time24hr = formatTo24Hour(date); // 👈 call the helper
  
    setFormData((prev) => {
      if (prev.times.includes(time24hr)) {
        alert('This time is already added!');
        return prev;
      }
  
      return {
        ...prev,
        times: [...prev.times, time24hr], // 👈 store 24-hour only
      };
    });
  
    setTimePickerVisible(false);
  };
  

  const removeTime = (index: number) => {
    setFormData((prev) => {
      const updatedTimes = [...prev.times];
      updatedTimes.splice(index, 1);
      return { ...prev, times: updatedTimes };
    });
  };

  const handleSubmit = async () => {
    if (!fireuser) {
      alert('Please log in to add medication!');
      return;
    }

    try {
      await addDoc(collection(db, 'medications'), formData);
      alert('Medication added!');
      setFormData({ user: fireuser.uid, name: '', dose: '', container: null, times: [] });
      router.push('/(root)/(tabs)/home'); // Navigate to home after adding medication
    } catch (err) {
      console.error(err);
      alert('Failed to add medication.');
    }
  };

  return (
    <View>
      <SubHeader
      title="Add Medicine"
      onBack={() => router.back()}
      />
      <ScrollView className="px-6 py-4">
        <View className="flex-row items-center border border-gray-300 p-3 mt-5 rounded-xl mb-3 bg-white">
          <Ionicons name="medkit-outline" size={24} color="#3b82f6" />
          <TextInput
            placeholder="Medicine Name"
            className="ml-3 flex-1 text-base"
            value={formData.name}
            onChangeText={(val) => handleInputChange('name', val)}
          />
        </View>

        <View className="flex-row items-center border border-gray-300 p-3 rounded-xl mb-3 bg-white">
          <MaterialCommunityIcons name="eyedropper" size={24} color="#3b82f6" />
          <TextInput
            placeholder="Number of Dose (eg. 2)"
            className="ml-3 flex-1 text-base"
            value={formData.dose}
            onChangeText={(val) => handleInputChange('dose', val)}
          />
        </View>

        <Text className="font-medium mt-3 mb-2">Choose Container</Text>
        <View className="flex-row space-x-4 mb-4">
          {[1, 2].map((num) => (
            <TouchableOpacity
              key={num}
              className={`py-4 px-5 mr-2 rounded-xl border ${formData.container === num ? 'bg-blue-500 border-blue-600' : 'border-gray-300'}`}
              onPress={() => handleInputChange('container', num)}
            >
              <Text className={formData.container === num ? 'text-white font-bold' : 'text-black'}>
                {`Container ${num}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="font-medium mb-2">Select Times</Text>
        <View className="flex-row flex-wrap gap-2 mb-2">
        {formData.times.map((time, idx) => {
          const [hours, minutes] = time.split(':');
          const date = new Date();
          date.setHours(Number(hours), Number(minutes));
          const formattedDisplay = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <View key={idx} className="bg-blue-100 flex-row items-center px-3 py-1 rounded-full mr-2 mb-2">
              <Text className="text-black mr-2 p-3">{formattedDisplay}</Text>
              <TouchableOpacity onPress={() => removeTime(idx)}>
                <Ionicons name="close-circle" size={20} color="#grey" />
              </TouchableOpacity>
            </View>
          );
        })}

        </View>
        <TouchableOpacity onPress={() => setTimePickerVisible(true)} className="bg-blue-500 py-3 rounded-xl mb-4">
          <Text className="text-white text-center font-semibold">+ Add Time</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={handleSubmit} className="bg-green-600 py-3 rounded-xl">
          <Text className="text-white text-center text-base font-bold">Save Medication</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={() => setTimePickerVisible(false)}
        />
      </ScrollView>
    </View>
  );
}
