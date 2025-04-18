import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  id: string;
  name: string;
  dose: string;
  times: string[];
  onPress?: () => void;
  onDelete: (id: string) => void;
};

const formatTo12Hour = (time: string) => {
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // convert '0' to '12'
  return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

export default function MedicineItem({ id, name, dose, times, onPress, onDelete }: Props) {
  const [translateX] = useState(new Animated.Value(0));

  const maxSlide = -65;  

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => Math.abs(gestureState.dx) > 5,
    onMoveShouldSetPanResponder: (e, gestureState) => Math.abs(gestureState.dx) > 5,
    onPanResponderMove: (e, gestureState) => {
      translateX.setValue(Math.max(gestureState.dx, maxSlide));  // Prevent going further than maxSlide
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx < maxSlide) {
        Animated.spring(translateX, { toValue: maxSlide, useNativeDriver: true }).start();
      } else {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
      }
    },
  });

  return (
    <View style={{ height: 110 , width: '100%' }} className='bg-white border border-gray-100'>
      <Animated.View
        style={{
          transform: [{ translateX }],
          zIndex: 15,
          backgroundColor: translateX.interpolate({
            inputRange: [maxSlide, 0], 
            outputRange: ['#fff','#fff' ], 
          }),
        }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity onPress={onPress} className="bg-white p-4 mb-4 border border-gray-100">
        <View className="mb-2">
          <View className="flex-row items-center mb-1">
            <Ionicons name="medkit-outline" size={20} color="#2563eb" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">{name}</Text>
          </View>

          <View className="flex-row items-center mb-1">
            <Ionicons name="fitness-outline" size={18} color="#6b7280" />
            <Text className="ml-2 text-gray-600 text-md">Dose: <Text className="font-medium text-gray-700">{dose}</Text></Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={18} color="#6b7280" />
            <Text className="ml-2 text-gray-600 text-md">Times: {times.map(formatTo12Hour).join(', ')}</Text>
          </View>
        </View>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        onPress={() => onDelete(id)}
        className="bg-red-500 justify-center items-center absolute right-0 top-0 bottom-0"
        style={{ width: 100, height: '100%' }} 
      >
        <Ionicons name="trash-outline" size={32} color="#fff" className='ml-10' />
      </TouchableOpacity>
    </View>
  );
}
