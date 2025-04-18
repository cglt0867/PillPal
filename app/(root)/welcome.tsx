import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

export default function welcome() {
    const router = useRouter()
  return (
    <ScrollView>
      {/* Image section */}
      <View className="flex justify-center items-center">
        <Image
          source={require('../../assets/images/medication.jpeg')}
          className="w-full h-72 rounded-xl" // Using Tailwind classes with NativeWind
        />
      </View>

      {/* Content section */}
      <View className="p-6 bg-primary h-full">
        <Text className="text-center text-3xl font-bold text-white mt-12">
          Stay on Track, Stay Healthy
        </Text>
        
        <Text className="text-center text-lg text-white mt-5">
          Track your meds, take control of your health. Stay Consistent. Stay Confident
        </Text>

        {/* Continue button */}
        <TouchableOpacity
          className="bg-white p-4 rounded-full mt-12 w-full"
          onPress={() => router.push('/sign-in')}
        >
          <Text className="text-center text-lg text-primary">Continue</Text>
        </TouchableOpacity>

        {/* Terms and conditions */}
        <Text className="mt-1 text-center text-xs text-white">
          By Clicking "Continue", you will agree to our terms and conditions.
        </Text>
      </View>
    </ScrollView>
  )
}