import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARnugZtC5kencbiq6w6oVJJEBukm923F0",
  authDomain: "lifeos-84289.firebaseapp.com",
  projectId: "lifeos-84289",
  storageBucket: "lifeos-84289.firebasestorage.app",
  messagingSenderId: "203120174698",
  appId: "1:203120174698:web:4a8dd6f7eec6ade7ffcc13",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);

// Google Provider
export const provider = new GoogleAuthProvider();

// Optional Google scopes
provider.addScope("profile");
provider.addScope("email");

// Always ask which Google account to use
provider.setCustomParameters({
  prompt: "select_account",
});

// Firestore Database
export const db = getFirestore(app);

// Export Firebase App
export default app;