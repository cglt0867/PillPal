import { Slot, usePathname } from "expo-router";
import { AuthContextProvider } from "@/context/authContext";
import { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import "../global.css"


export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);


  const pathname = usePathname();
  useEffect(() => {
    console.log("Current pathname:", pathname); // Log the current pathname
  }, [pathname]); // Add this line to log the pathname whenever it changes

  useEffect(() => {
    // Simulate an auth check delay (you can remove this after testing)
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after auth check or initialization
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
    );
  }

  return (
    <AuthContextProvider>
      <Slot />
    </AuthContextProvider>
  );
}
