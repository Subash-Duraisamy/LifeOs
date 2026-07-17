import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

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
    const cleanUsername = username
      .trim()
      .toLowerCase();

    const usernameRef = doc(
      db,
      "usernames",
      cleanUsername
    );

    const usernameDoc = await getDoc(usernameRef);

    if (usernameDoc.exists()) {
      throw new Error("Username already exists.");
    }

    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = result.user;

    await updateProfile(user, {
      displayName: fullName,
    });

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

    await setDoc(usernameRef, {
      uid: user.uid,
    });

    return result;

  } catch (error) {

    console.error("REGISTER FAILED");
    console.error(error);

    throw error;
  }
}

/* ===========================================
   GOOGLE LOGIN
=========================================== */

export async function googleLogin() {

  console.log("STEP 1 - Google Popup");

  const result = await signInWithPopup(
    auth,
    provider
  );

  console.log("Google Sign-In Success");

  const user = result.user;

  console.log(user);

  const userRef = doc(
    db,
    "users",
    user.uid
  );

  console.log("Checking users collection...");

  const userSnapshot =
    await getDoc(userRef);

  console.log(
    "User document exists:",
    userSnapshot.exists()
  );

  return {
    user,
    isNewUser: !userSnapshot.exists(),
  };
}

/* ===========================================
   CREATE GOOGLE USER
=========================================== */

export async function createGoogleUser(
  username
) {

  console.log("========== CREATE GOOGLE USER ==========");

  const user = auth.currentUser;

  console.log("Current User:", user);

  if (!user) {
    throw new Error("User not found.");
  }

  const cleanUsername = username
    .trim()
    .toLowerCase();

  console.log("Username:", cleanUsername);

  const usernameRef = doc(
    db,
    "usernames",
    cleanUsername
  );

  console.log("Checking username...");

  const usernameSnapshot =
    await getDoc(usernameRef);

  console.log(
    "Username Exists:",
    usernameSnapshot.exists()
  );

  if (usernameSnapshot.exists()) {
    throw new Error("Username already exists.");
  }

  console.log("Creating users document...");

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

  console.log("Users document created.");

  console.log("Creating username document...");

  await setDoc(
    usernameRef,
    {
      uid: user.uid,
    }
  );

  console.log("Username document created.");

  console.log("========== SUCCESS ==========");
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

export async function updateUserProfile(uid, data) {

  // ======================================
  // Update Users Collection
  // ======================================

  await updateDoc(
    doc(db, "users", uid),
    {
      ...data,
      updatedAt: serverTimestamp(),
    }
  );

  const batch = writeBatch(db);

  // ======================================
  // Friends Collection
  // ======================================

  const friendsQuery = query(
    collection(db, "friends"),
    where("users", "array-contains", uid)
  );

  const friendsSnapshot = await getDocs(friendsQuery);

  friendsSnapshot.forEach((friendDoc) => {

    const friendData = friendDoc.data();

    const updates = {};

    if (friendData.user1.uid === uid) {

      if (data.fullName !== undefined)
        updates["user1.fullName"] = data.fullName;

      if (data.username !== undefined)
        updates["user1.username"] = data.username;

      if (data.photoURL !== undefined)
        updates["user1.photoURL"] = data.photoURL;

      if (data.bio !== undefined)
        updates["user1.bio"] = data.bio;

    } else {

      if (data.fullName !== undefined)
        updates["user2.fullName"] = data.fullName;

      if (data.username !== undefined)
        updates["user2.username"] = data.username;

      if (data.photoURL !== undefined)
        updates["user2.photoURL"] = data.photoURL;

      if (data.bio !== undefined)
        updates["user2.bio"] = data.bio;

    }

    if (Object.keys(updates).length > 0) {
      batch.update(friendDoc.ref, updates);
    }

  });

  // ======================================
  // Friend Requests (Sent)
  // ======================================

  const sentRequests = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", uid)
  );

  const sentSnapshot = await getDocs(sentRequests);

  sentSnapshot.forEach((request) => {

    const updates = {};

    if (data.fullName !== undefined)
      updates.fromName = data.fullName;

    if (data.username !== undefined)
      updates.fromUsername = data.username;

    if (data.photoURL !== undefined)
      updates.fromPhoto = data.photoURL;

    if (Object.keys(updates).length > 0) {
      batch.update(request.ref, updates);
    }

  });

  // ======================================
  // Friend Requests (Received)
  // ======================================

  const receivedRequests = query(
    collection(db, "friendRequests"),
    where("toUid", "==", uid)
  );

  const receivedSnapshot = await getDocs(receivedRequests);

  receivedSnapshot.forEach((request) => {

    const updates = {};

    if (data.fullName !== undefined)
      updates.toName = data.fullName;

    if (data.username !== undefined)
      updates.toUsername = data.username;

    if (data.photoURL !== undefined)
      updates.toPhoto = data.photoURL;

    if (Object.keys(updates).length > 0) {
      batch.update(request.ref, updates);
    }

  });

  // ======================================
  // Ludo Rooms
  // ======================================

  const roomsSnapshot = await getDocs(
    collection(db, "ludoRooms")
  );

  roomsSnapshot.forEach((roomDoc) => {

    const room = roomDoc.data();

    const players = room.players.map((player) => {

      if (player.uid !== uid) {
        return player;
      }

      return {

        ...player,

        ...(data.fullName !== undefined && {
          fullName: data.fullName,
        }),

        ...(data.username !== undefined && {
          username: data.username,
        }),

        ...(data.photoURL !== undefined && {
          photoURL: data.photoURL,
        }),

      };

    });

    batch.update(roomDoc.ref, {
      players,
    });

  });

  // ======================================
  // Ludo Invites
  // ======================================

  const inviteQuery = query(
    collection(db, "ludoInvites"),
    where("fromUid", "==", uid)
  );

  const inviteSnapshot = await getDocs(inviteQuery);

  inviteSnapshot.forEach((inviteDoc) => {

    const updates = {};

    if (data.fullName !== undefined)
      updates.fromName = data.fullName;

    if (data.username !== undefined)
      updates.fromUsername = data.username;

    if (data.photoURL !== undefined)
      updates.fromPhoto = data.photoURL;

    if (Object.keys(updates).length > 0) {
      batch.update(inviteDoc.ref, updates);
    }

  });

  // ======================================
  // Commit
  // ======================================

  await batch.commit();

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
      username
        .trim()
        .toLowerCase()
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