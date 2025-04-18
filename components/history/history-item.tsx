import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons for checkmark and cross

type Props = {
  item: any;
};

const HistoryItem = ({ item }: Props) => {
  const handleConfirmTaken = async () => {
    try {
      await updateDoc(doc(db, 'medicationHistory', item.id), {
        status: 'taken',
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDateTime = (timestamp: any) => {
    const date = new Date(timestamp.seconds * 1000);

    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = formatDateTime(item.timeTaken);

  const getStatusStyles = (status: string) => {
    if (status === 'taken') {
      return {
        backgroundColor: 'bg-green-500', // Green background
        icon: <Ionicons name="checkmark-circle" size={24} color="white" />,
        statusText: 'Taken',
      };
    } else {
      return {
        backgroundColor: 'bg-red-500', // Red background
        icon: <Ionicons name="close-circle" size={24} color="white" />,
        statusText: 'Skipped',
      };
    }
  };

  const { backgroundColor, icon, statusText } = getStatusStyles(item.status);

  return (
    <View className="bg-white rounded-xl shadow-lg p-4 mb-4 border-1">
      <View className="flex-row items-center justify-between flex-1">
        <View>
          <Text className="font-bold text-lg">{item.medicineName}</Text>
          <Text className="text-md text-gray-500">
            {formattedTime} on {formattedDate}
          </Text>
        </View>

        <View className={`flex-row items-center ${backgroundColor} p-2 rounded-full justify-center w-1/3`}>
          {icon}
          <Text className="text-white ml-2 font-bold">{statusText}</Text>
        </View>
      </View>

      {item.status === 'skipped' && (
          <TouchableOpacity
          onPress={handleConfirmTaken}
          className="bg-blue-500 text-white py-2 px-4 rounded-full mt-7 w-1/2 self-center"
        >
          <Text className="text-center font-semibold text-white">Just Took It!</Text>
        </TouchableOpacity>
        )}
    </View>
  );
};

export default HistoryItem;
