import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import { updatePassword } from 'firebase/auth'
import { useAuth } from '@/context/authContext'

export default function ChangePassword() {
  const { fireuser } = useAuth()
  const [newPassword, setNewPassword] = useState('')

  const handlePasswordChange = async () => {
    if (!fireuser || !newPassword) return

    try {
      await updatePassword(fireuser, newPassword)
      ToastAndroid.show('Password updated successfully!', ToastAndroid.SHORT)
      setNewPassword('')
    } catch (error: any) {
      ToastAndroid.show('Failed to update password.', ToastAndroid.SHORT)
      console.error('Password change error:', error)
    }
  }

  return (
    <View className="p-6">
      <Text className="text-2xl font-bold text-center mb-6">Change Password</Text>

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        className="p-4 border border-gray-300 rounded-xl mb-4"
      />
      <TouchableOpacity
        onPress={handlePasswordChange}
        className="bg-red-500 p-4 rounded-xl"
      >
        <Text className="text-white text-center text-lg">Update Password</Text>
      </TouchableOpacity>
    </View>
  )
}
