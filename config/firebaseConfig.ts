// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getReactNativePersistence,initializeAuth, getAuth,} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-librariesnpm i @react-native-async-storage/async-storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM1XobXZVYn6zKu0GeTh-z-yOdFWyQw9o",
  authDomain: "pillpal-a9262.firebaseapp.com",
  projectId: "pillpal-a9262",
  storageBucket: "pillpal-a9262.firebasestorage.app",
  messagingSenderId: "952782452373",
  appId: "1:952782452373:web:4fa14cbf8bdd17ee8d0d9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});


// Initialize Firebase
export const db = getFirestore(app);