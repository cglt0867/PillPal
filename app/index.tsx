import { useEffect, useState } from "react";
import { Redirect, Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "@/context/authContext";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {
  const { isAuthenticated } = useAuth();
  const segments: string[] = useSegments();
  const router = useRouter();

  const [hasInitialized, setHasInitialized] = useState(false); // Track initialization
  const [isLoading, setIsLoading] = useState(true); // To handle loading state during first initialization

  useEffect(() => {
    if (typeof isAuthenticated === "undefined") {
      console.log("isAuthenticated is undefined, waiting for auth context to be initialized");
      return; // Wait until isAuthenticated is set
    }

    // Initialize after the first authentication state check
    if (!hasInitialized) {
      setHasInitialized(true);
      setIsLoading(false); // Set loading to false after first initialization
      return; // Skip navigation logic for the first run
    }

    console.log("isAuthenticated:", isAuthenticated);

    const current = segments[segments.length - 1];
    const isInTabs = segments.includes("(tabs)");
    const isInAuth = ["sign-in", "sign-up", "welcome"].includes(current || "");

    // Redirect to tabs if authenticated and not already in tabs
    if (isAuthenticated && !isInTabs) {
      router.replace("/(root)/(tabs)/home");
    }

    // Redirect to welcome if not authenticated and not already on an auth screen
    if (!isAuthenticated && !isInAuth) {
      console.log("Redirecting to welcome");
      router.replace("/welcome");
    }
  }, [isAuthenticated, segments, hasInitialized]);

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
    );
  }

  return (
    <Redirect href= "/welcome" /> // Redirect to welcome screen if not authenticated and not on auth screens
  );
}
