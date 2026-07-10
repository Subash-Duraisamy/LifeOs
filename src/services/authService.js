import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  provider,
  db,
} from "../firebase/firebase";

/* ===========================================
   EMAIL LOGIN
=========================================== */

export async function login(email, password) {
  return await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}
/* ===========================================
   EMAIL REGISTER
=========================================== */

export async function register(
  fullName,
  username,
  email,
  password
) {
  try {

    console.log("STEP 1 - Cleaning username");

    const cleanUsername = username
      .trim()
      .toLowerCase();

    const usernameRef = doc(
      db,
      "usernames",
      cleanUsername
    );

    console.log("STEP 2 - Checking username");

    const usernameDoc =
      await getDoc(usernameRef);

    console.log("STEP 2 DONE");

    if (usernameDoc.exists()) {
      throw new Error("Username already exists.");
    }

    console.log("STEP 3 - Creating Auth User");

    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    console.log("STEP 3 DONE");

    const user = result.user;

    console.log("UID :", user.uid);

    console.log("STEP 4 - Updating Auth Profile");

    await updateProfile(user, {
      displayName: fullName,
    });

    console.log("STEP 4 DONE");

    console.log("STEP 5 - Creating users document");

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,

        fullName,

        username: cleanUsername,

        email,

        photoURL: user.photoURL || "",

        provider: "email",

        bio: "",

        theme: "dark",

        onboardingCompleted: true,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      }
    );

    console.log("STEP 5 DONE");

    console.log("STEP 6 - Creating username document");

    await setDoc(
      usernameRef,
      {
        uid: user.uid,
      }
    );

    console.log("STEP 6 DONE");

    return result;

  } catch (error) {

    console.error("================================");
    console.error("REGISTER FAILED");
    console.error(error);
    console.error("CODE :", error.code);
    console.error("MESSAGE :", error.message);
    console.error("================================");

    throw error;
  }
}
/* ===========================================
   GOOGLE LOGIN
=========================================== */

export async function googleLogin() {
  const result = await signInWithPopup(
    auth,
    provider
  );

  const user = result.user;

  const userRef = doc(
    db,
    "users",
    user.uid
  );

  const userSnapshot = await getDoc(userRef);

  return {
    user,
    isNewUser: !userSnapshot.exists(),
  };
}

/* ===========================================
   CREATE GOOGLE USER PROFILE
=========================================== */

export async function createGoogleUser(
  username
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not found.");
  }

  const cleanUsername = username
    .trim()
    .toLowerCase();

  const usernameRef = doc(
    db,
    "usernames",
    cleanUsername
  );

  const usernameSnapshot =
    await getDoc(usernameRef);

  if (usernameSnapshot.exists()) {
    throw new Error("Username already exists.");
  }

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,

      fullName: user.displayName || "",

      username: cleanUsername,

      email: user.email || "",

      photoURL: user.photoURL || "",

      provider: "google",

      bio: "",

      theme: "dark",

      onboardingCompleted: true,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    }
  );

  await setDoc(usernameRef, {
    uid: user.uid,
  });
}

/* ===========================================
   FORGOT PASSWORD
=========================================== */

export async function forgotPassword(
  email
) {
  return await sendPasswordResetEmail(
    auth,
    email
  );
}

/* ===========================================
   UPDATE USER PROFILE
=========================================== */

export async function updateUserProfile(
  uid,
  data
) {
  await updateDoc(
    doc(db, "users", uid),
    {
      ...data,

      updatedAt: serverTimestamp(),
    }
  );
}

/* ===========================================
   GET USER
=========================================== */

export async function getUser(uid) {
  const snapshot = await getDoc(
    doc(db, "users", uid)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}

/* ===========================================
   CHECK USERNAME
=========================================== */

export async function usernameExists(
  username
) {
  const snapshot = await getDoc(
    doc(
      db,
      "usernames",
      username.trim().toLowerCase()
    )
  );

  return snapshot.exists();
}

/* ===========================================
   LOGOUT
=========================================== */

export async function logout() {
  return await signOut(auth);
}