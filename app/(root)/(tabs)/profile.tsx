import React, { useEffect, useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, ToastAndroid, ScrollView, Alert } from 'react-native'
import { useAuth } from '@/context/authContext'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db } from '@/config/firebaseConfig'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router' // For navigation
import Header from '@/components/header'
import HistoryList from '@/components/history/history-list'

export default function Profile() {
  const { fireuser, logout } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // const router = useRouter() // Use the useRouter hook for navigation

  useEffect(() => {
    const fetchUserData = async () => {
      if (!fireuser) return
      const userDoc = await getDoc(doc(db, 'users', fireuser.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setUsername(data.username)
        setEmail(data.email)
        setPhotoURL(data.photoURL || '')
      }
    }

    fetchUserData()
  }, [fireuser])

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      ToastAndroid.show('Permission to access photos is required.', ToastAndroid.SHORT)
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    })

    if (!result.canceled && result.assets) {
      setPhotoURL(result.assets[0].uri)
    }
  }

  const handleEditToggle = async () => {
    if (isEditing && fireuser) {
      try {
        await updateProfile(fireuser, {
          displayName: username,
          photoURL: photoURL
        })

        await updateDoc(doc(db, 'users', fireuser.uid), {
          username,
          photoURL
        })

        ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT)
      } catch (error: any) {
        ToastAndroid.show('Failed to update profile.', ToastAndroid.SHORT)
        console.error('Update error:', error)
      }
    }
    setIsEditing(!isEditing)
  }

  return (
    <ScrollView className="">
      <Header routeName="profile" onEditToggle={handleEditToggle} isEditing={isEditing} />
      
      <View className="flex-row items-center space-x-4 p-5">
        {/* Profile Photo & Edit Icon */}
        <TouchableOpacity onPress={isEditing ? pickImage : undefined} className="relative">
          {isEditing && (
            <View className="absolute top-1 right-1 z-10 bg-white p-2 rounded-full shadow-lg">
              <Ionicons name="pencil" size={24} color="black" />
            </View>
          )}
          <Image
            source={photoURL ? { uri: photoURL } : require('../../../assets/images/default-prof.png')}
            className="w-28 h-28 rounded-full border-2 border-gray-300"
          />
        </TouchableOpacity>

        {/* User Info */}
        <View className="flex-1 px-3">
          <TextInput
            value={username}
            onChangeText={setUsername}
            editable={isEditing}
            className={`text-lg font-semibold ${!isEditing ? 'text-black' : 'border border-blue-300 px-1 rounded-lg'}`}
          />
          <Text className="text-gray-600 ml-1">{email}</Text>
        </View>

        {/* Logout Icon */}
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Log Out',
              'Are you sure you want to log out?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Log Out',
                  style: 'destructive',
                  onPress: async () => {
                    await logout();
                    router.replace('/welcome');
                  },
                },
              ],
              { cancelable: true }
            )
          }
          className="p-2"
        >
          <Ionicons name="log-out-outline" size={28} color="#B91C1C" />
        </TouchableOpacity>
      </View>
      
      

      <View className="h-px bg-gray-300 mb-4 mx-6" />

        <Text className="text-xl font-bold px-6 mb-2">Medication History</Text>
        <HistoryList />

        <View className="px-14 mt-6">
          
        </View>
    </ScrollView>
  )
}
