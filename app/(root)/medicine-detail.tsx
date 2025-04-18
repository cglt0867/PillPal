import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { db } from '@/config/firebaseConfig';
import SubHeader from '@/components/subheader';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


export default function MedicineDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  
  const handleEditToggle = () => setEditMode(!editMode);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'medications', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (field: string, value: any) => {
    setData((prev: any) => ({ ...prev, [field]: value }));
  };

  const formatTo24Hour = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };
  
  const handleConfirmTime = (date: Date) => {
    const formatted = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 👈 24-hour format
    });
  
    if (data.times.includes(formatted)) {
      alert('This time is already added!');
      return;
    }
  
    setData((prev: any) => ({
      ...prev,
      times: [...prev.times, formatted].sort(),
    }));
  
    setTimePickerVisible(false);
  };
  
  

  const removeTime = (index: number) => {
    const updatedTimes = [...data.times];
    updatedTimes.splice(index, 1);
    setData((prev: any) => ({ ...prev, times: updatedTimes }));
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'medications', id as string);
      await updateDoc(docRef, data);
      Alert.alert('Success', 'Medication updated!');
      setEditMode(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Confirm Delete', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'medications', id as string));
          Alert.alert('Deleted');
          router.back();
        },
      },
    ]);
  };

  if (!data) return <Text className="mt-20 text-center">Loading...</Text>;

  return (
    <View>
      <SubHeader
        title={editMode ? 'Edit Medicine' : 'Medicine Details'}
        onBack={() => router.back()}
        onEditToggle={handleEditToggle}
        editMode={editMode}
      />
      
      <ScrollView className="px-6 py-4">
        {/* Medicine Name Input */}
          <View
            className={`flex-row items-center p-2 mt-3 rounded-xl mb-3 bg-white ${
              editMode ? 'border-2 border-blue-500' : 'border border-gray-300'
            }`}
          >
            <Ionicons name="medkit-outline" size={24} color="#3b82f6" />
            <TextInput
              editable={editMode}
              value={data.name}
              placeholder="Medicine Name"
              className="ml-3 flex-1 text-base"
              onChangeText={(val) => handleInputChange('name', val)}
            />
          </View>

          {/* Dose Input */}
          <View
            className={`flex-row items-center p-2 rounded-xl mb-3 bg-white ${
              editMode ? 'border-2 border-blue-500' : 'border border-gray-300'
            }`}
          >
            <MaterialCommunityIcons name="eyedropper" size={24} color="#3b82f6" />
            <TextInput
              editable={editMode}
              value={data.dose}
              placeholder="Dose"
              className="ml-3 flex-1 text-base"
              onChangeText={(val) => handleInputChange('dose', val)}
            />
          </View>

        {/* Container Selection */}
        <Text className="font-medium mt-3 mb-2">Container</Text>
        <View className="flex-row space-x-3 mb-4">
          {[1, 2].map((num) => (
            <TouchableOpacity
              key={num}
              disabled={!editMode}
              className={`py-3 px-4 mr-2 rounded-xl border ${data.container === num ? 'bg-blue-500 border-blue-600' : 'border-gray-300'}`}
              onPress={() => handleInputChange('container', num)}
            >
              <Text className={data.container === num ? 'text-white font-bold' : 'text-black'}>
                Container {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Selection */}
        <Text className="font-medium mb-2">Times</Text>
        <View className="flex-row flex-wrap gap-2 mb-2">
          {data.times.map((time: string, idx: number) => {
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
                {editMode && (
                  <TouchableOpacity onPress={() => removeTime(idx)}>
                    <Ionicons name="close-circle" size={20} color="#grey" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
        {editMode && (
          <TouchableOpacity onPress={() => setTimePickerVisible(true)} className="bg-blue-500 py-4 rounded-xl mb-4">
            <Text className="text-white text-center font-semibold">+ Add Time</Text>
          </TouchableOpacity>
        )}


        

        <View className="px-4 mt-10">
          {/* Buttons */}
          <View className="flex-row justify-between items-center mb-3">
            {editMode ? (
              <>
                <TouchableOpacity
                  onPress={handleUpdate}
                  className="bg-green-600 py-4 rounded-xl w-1/2 mr-2"
                >
                  <Text className="text-white text-center font-bold">Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setEditMode((prev) => !prev)}
                  className="bg-blue-500 py-4 rounded-xl w-1/2"
                >
                  <Text className="text-white text-center font-bold">Cancel</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>

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
