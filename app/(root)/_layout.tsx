import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "@/context/authContext";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {
  const { isAuthenticated } = useAuth();
  const segments: string[] = useSegments();
  const router = useRouter();

  const [hasInitialized, setHasInitialized] = useState(false); // Track initialization
  const [isLoading, setIsLoading] = useState(true); // To handle loading state during first initialization



  return (
    <Stack>
      {/* Authentication screens */}
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="medicine-detail" options={{ headerShown: false }} />
      <Stack.Screen name="add-new-med" options={{ headerShown: false }} />
      
      {/* Change password screen inside (root) */}
      <Stack.Screen name="change-pass" options={{ title: "Change Password", headerTitleAlign: "center" }} />
      
      {/* Tab screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
