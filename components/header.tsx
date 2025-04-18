import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';

type Props = {
  routeName: string;
  onEditToggle?: () => void;
  isEditing?: boolean;
};

export default function Header({ routeName, onEditToggle, isEditing }: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const getTitle = () => {
    switch (routeName) {
      case 'profile':
        return 'My Profile';
      case 'home':
        return `Hello ${user?.displayName || ''}! 👋`;
      default:
        return '';
    }
  };

  return (
    <View className="px-4 py-6 bg-white shadow relative">
      <View className="flex-row items-center justify-center relative">
        {/* Left Icon */}
        <View className="absolute left-0">
          <Image
            source={require('../assets/images/smiley.png')}
            className="w-10 h-10"
          />
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-center">{getTitle()}</Text>

        {/* Right Icon */}
        {onEditToggle && (
          <TouchableOpacity className="absolute right-0" onPress={onEditToggle}>
            <Ionicons
              name={routeName === 'profile' && isEditing ? 'checkmark-outline' : 'pencil-outline'}
              size={26}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
