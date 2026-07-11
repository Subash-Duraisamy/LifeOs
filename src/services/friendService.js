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

  return snapshot.docs.map((document) => ({
    uid: document.id,
    ...document.data(),
  }));

}

/* ======================================
   SEND FRIEND REQUEST
====================================== */

/* ======================================
   SEND FRIEND REQUEST
====================================== */

export async function sendFriendRequest(
  fromUser,
  toUser
) {

  if (fromUser.uid === toUser.uid) {
    throw new Error("You cannot add yourself.");
  }

  // Pending request from me...
  // -----------------------------
  // Already friends?
  // -----------------------------



  // -----------------------------
  // Pending request from me
  // -----------------------------

  const sentQuery = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", fromUser.uid),
    where("toUid", "==", toUser.uid),
    where("status", "==", "pending")
  );

  const sentSnapshot =
    await getDocs(sentQuery);

  if (!sentSnapshot.empty) {
    throw new Error("Friend request already sent.");
  }

  // -----------------------------
  // Pending request from them
  // -----------------------------

  const receivedQuery = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", toUser.uid),
    where("toUid", "==", fromUser.uid),
    where("status", "==", "pending")
  );

  const receivedSnapshot =
    await getDocs(receivedQuery);

  if (!receivedSnapshot.empty) {
    throw new Error(
      "This user has already sent you a friend request."
    );
  }

  // -----------------------------
  // Create Request
  // -----------------------------

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
    where("users", "array-contains", currentUid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.some((document) => {

    const users = document.data().users;

    return users.includes(targetUid);

  });

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

      users: [
        currentUser.uid,
        request.fromUid,
      ],

      user1: {

        uid: currentUser.uid,

        fullName: currentUser.fullName,

        username: currentUser.username,

        photoURL:
          currentUser.photoURL || "",

      },

      user2: {

        uid: request.fromUid,

        fullName: request.fromName,

        username: request.fromUsername,

        photoURL:
          request.fromPhoto || "",

      },

      createdAt:
        serverTimestamp(),

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
  currentUid,
  friendUid
) {

  const q = query(
    collection(db, "friends"),
    where("users", "array-contains", currentUid)
  );

  const snapshot = await getDocs(q);

  for (const document of snapshot.docs) {

    const users =
      document.data().users;

    if (users.includes(friendUid)) {

      await deleteDoc(
        doc(
          db,
          "friends",
          document.id
        )
      );

      break;

    }

  }

}