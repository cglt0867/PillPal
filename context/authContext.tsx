// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import { ToastAndroid } from "react-native";
import { doc, setDoc } from "firebase/firestore";

interface AuthContextType {
  fireuser: User | null;
  isAuthenticated: boolean | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [fireuser, setFireuser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(
        undefined
    );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFireuser(user);
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      ToastAndroid.show("Logged in successfully!", ToastAndroid.SHORT);
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      ToastAndroid.show("Logged out.", ToastAndroid.SHORT);
    } catch (error: any) {
      ToastAndroid.show("Logout failed.", ToastAndroid.SHORT);
    }
  };

  const register = async (email: string, password: string, username: string, photoURL?: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        // If the user is created, update the profile with the username and photoURL (if provided)
        await updateProfile(auth.currentUser, {
          displayName: username,
          photoURL: photoURL || "",  // Optional: Store the URL if user provided one
        });
  
        const userId = auth.currentUser.uid;
        const userData = {
          email,
          username,
          photoURL: photoURL || "",  // Store photoURL as a string
        };
  
        // Log to check if userId and userData are correct
        console.log("userId:", userId);
        console.log("userData:", userData);
  
        // Save user data to Firestore
        await setDoc(doc(db, "users", userId), userData);
        console.log("User data successfully saved to Firestore!");
      }
      ToastAndroid.show("Account created!", ToastAndroid.SHORT);
    } catch (error: any) {
      console.error("Error creating account or saving to Firestore:", error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    }

  
  }
  return (
    <AuthContext.Provider value={{ fireuser, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthContextProvider");
  return context;
};
