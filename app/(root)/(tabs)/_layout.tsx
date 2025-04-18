import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/header";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        header: () => <Header routeName={route.name} />,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'home') iconName = 'home';
          else if (route.name === 'profile') iconName = 'person';
          else iconName = 'ellipse';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />

      <Tabs.Screen name="profile" options={{ title: 'Profile', headerShown: false }} />
    </Tabs>
  );
}
