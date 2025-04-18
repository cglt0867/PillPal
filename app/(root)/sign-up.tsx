// sign-up.tsx
import React, { useState } from 'react'
import { Text, View, TouchableOpacity, ToastAndroid, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/authContext' 

export default function Signup() {
  const router = useRouter()
  const { register } = useAuth()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [userName, setUserName] = useState<string>('')

  const onCreateAccount = async () => {
    if (!email || !password || !userName) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.BOTTOM)
      return
    }

    try {
      await register(email, password, userName)
      router.push("/(root)/(tabs)/home") // Navigate after successful registration
    } catch (error) {
      ToastAndroid.show('Error during registration', ToastAndroid.BOTTOM)
    }
  }

  return (
    <View className="p-6 m-6 pt-16 flex-1">
      <Text className="text-3xl font-bold text-center mb-4">Sign Up Now!</Text>
      <Text className="text-lg text-gray-500 text-center mb-6">Let's make you an account! :)</Text>

      <View className="mb-4">
        <Text className="text-lg">Full Name</Text>
        <TextInput
          placeholder="Full Name"
          value={userName}
          onChangeText={setUserName}
          className="p-4 border border-gray-300 rounded-xl mt-2"
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg">Email</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          className="p-4 border border-gray-300 rounded-xl mt-2"
        />
      </View>

      <View className="mb-6">
        <Text className="text-lg">Password</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          className="p-4 border border-gray-300 rounded-xl mt-2"
        />
      </View>

      <TouchableOpacity
        onPress={onCreateAccount}
        className="bg-blue-500 p-4 rounded-xl mt-6"
      >
        <Text className="text-white text-center text-lg">Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/sign-in')}
        className="p-4 mt-4"
      >

        
        <Text className="text-center text-gray-500">Already Have An Account?</Text>
      </TouchableOpacity>
    </View>
  )
}
