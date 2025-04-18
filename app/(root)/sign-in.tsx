import React, { useState } from 'react';
import { View, Text, TextInput, ToastAndroid, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext'; 

const SignIn = () => {
  const router = useRouter();
  const { login } = useAuth();  // Use login function from AuthContext
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onLoginClick = async () => {
    if (!email || !password) {
      ToastAndroid.show('Please enter Email and Password', ToastAndroid.BOTTOM);
      return;
    }

    try {
      await login(email, password);  // Call login function from context
      router.replace("/(root)/(tabs)/home");
      ToastAndroid.show('Logged in successfully!', ToastAndroid.BOTTOM);
    } catch (error: any) {
      ToastAndroid.show('Login failed. Please check your credentials.', ToastAndroid.BOTTOM);
    }
  };

  return (
    <View className="p-6 m-6 pt-16 flex-1">
      <Text className="text-3xl font-bold text-center mt-4">Let's Sign You In</Text>
      <Text className="text-xl font-bold text-center mt-2 text-gray-500">Welcome Back! You've been missed</Text>

      <View className="mt-6">
        <Text className="text-lg">Email</Text>
        <TextInput
          placeholder="Email"
          className="p-4 border-2 border-gray-300 rounded-xl mt-2"
          onChangeText={(value) => setEmail(value)}
        />
      </View>

      <View className="mt-6">
        <Text className="text-lg">Password</Text>
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          className="p-4 border-2 border-gray-300 rounded-xl mt-2"
          onChangeText={(value) => setPassword(value)}
        />
      </View>

      <View className="mt-8">
        <TouchableOpacity
          className="bg-primary p-4 rounded-xl"
          onPress={onLoginClick}
        >
          <Text className="text-center text-white text-lg">Login</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-4">
        <TouchableOpacity
          className="bg-gray-300 p-4 rounded-xl"
          onPress={() => router.push('/sign-up')}
        >
          <Text className="text-center text-primary text-lg">Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;
