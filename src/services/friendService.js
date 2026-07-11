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
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* ======================================
   FRIENDSHIP DOCUMENT ID
====================================== */

function getFriendshipId(uid1, uid2) {

  return [uid1, uid2]
    .sort()
    .join("_");

}

/* ======================================
   SEARCH USERS
====================================== */

export async function searchUsers(search) {

  const text = search
    .trim()
    .toLowerCase();

  if (!text) return [];

  const q = query(

    collection(db, "users"),

    where("username", ">=", text),

    where(
      "username",
      "<=",
      text + "\uf8ff"
    )

  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map(
    (document) => ({

      uid: document.id,

      ...document.data(),

    })
  );

}
/* ======================================
   SEND FRIEND REQUEST
====================================== */

export async function sendFriendRequest(
  fromUser,
  toUser
) {

  if (fromUser.uid === toUser.uid) {
    throw new Error(
      "You cannot add yourself."
    );
  }

  // =====================================
  // Already Friends?
  // =====================================

  const friendshipId = getFriendshipId(
    fromUser.uid,
    toUser.uid
  );

  const friendshipRef = doc(
    db,
    "friends",
    friendshipId
  );

  const friendshipSnapshot =
    await getDoc(friendshipRef);

  if (friendshipSnapshot.exists()) {
    throw new Error(
      "Already friends."
    );
  }

  // =====================================
  // Pending request from me?
  // =====================================

  const sentQuery = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", fromUser.uid),
    where("toUid", "==", toUser.uid),
    where("status", "==", "pending")
  );

  const sentSnapshot =
    await getDocs(sentQuery);

  if (!sentSnapshot.empty) {

    throw new Error(
      "Friend request already sent."
    );

  }

  // =====================================
  // Pending request from them?
  // =====================================

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

  // =====================================
  // Create Friend Request
  // =====================================

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
   CHECK FRIEND REQUEST
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

  const snapshot =
    await getDocs(q);

  return !snapshot.empty;

}

/* ======================================
   CHECK FRIEND
====================================== */

export async function checkFriend(
  currentUid,
  targetUid
) {

  const friendshipId =
    getFriendshipId(
      currentUid,
      targetUid
    );

  const friendshipRef = doc(
    db,
    "friends",
    friendshipId
  );

  const snapshot =
    await getDoc(friendshipRef);

  return snapshot.exists();

}
/* ======================================
   ACCEPT FRIEND REQUEST
====================================== */

export async function acceptFriendRequest(
  requestId,
  request,
  currentUser
) {

  // =====================================
  // Mark request as accepted
  // =====================================

  await updateDoc(
    doc(db, "friendRequests", requestId),
    {
      status: "accepted",
    }
  );

  // =====================================
  // Create deterministic friendship ID
  // =====================================

  const friendshipId =
    getFriendshipId(
      currentUser.uid,
      request.fromUid
    );

  // =====================================
  // Save friendship document
  // =====================================

  await setDoc(
    doc(
      db,
      "friends",
      friendshipId
    ),
    {

      users: [
        currentUser.uid,
        request.fromUid,
      ],

      user1: {

        uid: currentUser.uid,

        fullName:
          currentUser.fullName,

        username:
          currentUser.username,

        photoURL:
          currentUser.photoURL || "",

      },

      user2: {

        uid: request.fromUid,

        fullName:
          request.fromName,

        username:
          request.fromUsername,

        photoURL:
          request.fromPhoto || "",

      },

      createdAt:
        serverTimestamp(),

    }

  );

}
/* ======================================
   REJECT FRIEND REQUEST
====================================== */

export async function rejectFriendRequest(
  requestId
) {

  await updateDoc(
    doc(
      db,
      "friendRequests",
      requestId
    ),
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

  const friendshipId =
    getFriendshipId(
      currentUid,
      friendUid
    );

  await deleteDoc(
    doc(
      db,
      "friends",
      friendshipId
    )
  );

}