import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  provider,
  db,
} from "../firebase/firebase";

import AuthContext from "./AuthContext";

function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  async function login() {
    await signInWithPopup(auth, provider);
  }

  async function logout() {
    await signOut(auth);
  }

  async function loadUser(firebaseUser) {

    if (!firebaseUser) {

      setUser(null);

      setLoading(false);

      return;

    }

    try {

      const userRef = doc(
        db,
        "users",
        firebaseUser.uid
      );

      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {

        const profile = snapshot.data();

        console.log("=========== FIRESTORE DATA ===========");
        console.log(profile);

        const mergedUser = {

          uid: firebaseUser.uid,

          email: firebaseUser.email || "",

          fullName:
            profile.fullName ||
            firebaseUser.displayName ||
            "",

          username:
            profile.username || "",

          photoURL:
            profile.photoURL ||
            firebaseUser.photoURL ||
            "",

          bio:
            profile.bio || "",

          provider:
            profile.provider || "",

          theme:
            profile.theme || "dark",

          onboardingCompleted:
            profile.onboardingCompleted ?? false,

          createdAt:
            profile.createdAt,

          updatedAt:
            profile.updatedAt,

        };

        console.log("=========== USER IN CONTEXT ===========");
        console.log(mergedUser);

        setUser(mergedUser);
        console.log("Context User");
        console.log(mergedUser);

      } else {

        console.log("Firestore document not found.");

        setUser({

          uid: firebaseUser.uid,

          email:
            firebaseUser.email || "",

          fullName:
            firebaseUser.displayName || "",

          username: "",

          photoURL:
            firebaseUser.photoURL || "",

          bio: "",

        });

      }

    } catch (error) {

      console.error("AUTH PROVIDER ERROR");
      console.error(error);

    }

    setLoading(false);

  }

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        loadUser
      );

    return unsubscribe;

  }, []);

  async function refreshUser() {

    if (!auth.currentUser) return;

    await loadUser(auth.currentUser);

  }

  return (

    <AuthContext.Provider
      value={{

        user,

        loading,

        login,

        logout,

        refreshUser,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

}

export default AuthProvider;