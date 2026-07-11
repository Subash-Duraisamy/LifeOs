import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* ======================================
   SEARCH USERS
====================================== */

export async function searchUsers(search) {

  const text = search.trim().toLowerCase();

  if (!text) return [];

  const q = query(
    collection(db, "users"),
    where("username", ">=", text),
    where("username", "<=", text + "\uf8ff")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));

}

/* ======================================
   SEND FRIEND REQUEST
====================================== */

export async function sendFriendRequest(fromUser, toUser) {

  if (fromUser.uid === toUser.uid) {
    throw new Error("You cannot add yourself.");
  }

  const duplicateQuery = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", fromUser.uid),
    where("toUid", "==", toUser.uid),
    where("status", "==", "pending")
  );

  const duplicateSnapshot = await getDocs(duplicateQuery);

  if (!duplicateSnapshot.empty) {
    throw new Error("Friend request already sent.");
  }

  await addDoc(
    collection(db, "friendRequests"),
    {

      fromUid: fromUser.uid,
      fromName: fromUser.fullName,
      fromUsername: fromUser.username,
      fromPhoto: fromUser.photoURL || "",

      toUid: toUser.uid,
      toName: toUser.fullName,
      toUsername: toUser.username,
      toPhoto: toUser.photoURL || "",

      status: "pending",

      createdAt: serverTimestamp(),

    }
  );

}

/* ======================================
   CHECK REQUEST
====================================== */

export async function checkFriendRequest(
  currentUid,
  targetUid
) {

  const q = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", currentUid),
    where("toUid", "==", targetUid),
    where("status", "==", "pending")
  );

  const snapshot = await getDocs(q);

  return !snapshot.empty;

}

/* ======================================
   CHECK FRIEND
====================================== */

export async function checkFriend(
  currentUid,
  targetUid
) {

  const q = query(
    collection(db, "friends"),
    where("uid", "==", currentUid),
    where("friendUid", "==", targetUid)
  );

  const snapshot = await getDocs(q);

  return !snapshot.empty;

}

/* ======================================
   ACCEPT REQUEST
====================================== */

export async function acceptFriendRequest(
  requestId,
  request,
  currentUser
) {

  await updateDoc(
    doc(db, "friendRequests", requestId),
    {
      status: "accepted",
    }
  );

  await addDoc(
    collection(db, "friends"),
    {

      uid: currentUser.uid,

      friendUid: request.fromUid,

      friendName: request.fromName,

      friendUsername: request.fromUsername,

      friendPhoto: request.fromPhoto,

      createdAt: serverTimestamp(),

    }
  );

  await addDoc(
    collection(db, "friends"),
    {

      uid: request.fromUid,

      friendUid: currentUser.uid,

      friendName: currentUser.fullName,

      friendUsername: currentUser.username,

      friendPhoto: currentUser.photoURL,

      createdAt: serverTimestamp(),

    }
  );

}

/* ======================================
   REJECT REQUEST
====================================== */

export async function rejectFriendRequest(
  requestId
) {

  await updateDoc(
    doc(db, "friendRequests", requestId),
    {
      status: "rejected",
    }
  );

}

/* ======================================
   REMOVE FRIEND
====================================== */

export async function removeFriend(
  friendDocumentId
) {

  await deleteDoc(
    doc(db, "friends", friendDocumentId)
  );

}