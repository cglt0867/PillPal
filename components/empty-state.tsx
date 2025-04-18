import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';



export default function EmpyState() {
  const router = useRouter();

  return (
    <View className=" h-[80%] justify-center items-center">
      <Image
        source={require('../assets/images/medicine.png')}
        className="w-40 h-40"
      />
      <Text className="text-3xl font-bold mt-8">No Mediciations!</Text>
      <Text className="text-lg text-gray-600 mt-5">Set Up Your Medication Schedule with us</Text>
      <Text className="text-lg text-gray-600">Click on the Blue Plus Icon below!</Text>
    </View>
  );
}
