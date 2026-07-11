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

  try {

    const text = search.trim().toLowerCase();

    if (!text) return [];

    console.log("Searching:", text);

    const q = query(
      collection(db, "users"),
      where("username", ">=", text),
      where("username", "<=", text + "\uf8ff")
    );

    const snapshot = await getDocs(q);

    console.log("Documents:", snapshot.docs.length);

    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
    }));

  } catch (error) {

    console.log(error.code);
    console.log(error.message);
    throw error;

  }

}
/* ======================================
   SEND FRIEND REQUEST
====================================== */

export async function sendFriendRequest(fromUser, toUser) {

  try {

    console.log("STEP 1");

    if (fromUser.uid === toUser.uid) {
      throw new Error("You cannot add yourself.");
    }

    console.log("STEP 2");

    // =====================================
    // Already Friends?
    // =====================================

const alreadyFriends = await checkFriend(
  fromUser.uid,
  toUser.uid
);

if (alreadyFriends) {
  throw new Error("Already friends.");
}
    console.log("STEP 5");

    // =====================================
    // Pending request from me?
    // =====================================

    const sentQuery = query(
      collection(db, "friendRequests"),
      where("fromUid", "==", fromUser.uid),
      where("toUid", "==", toUser.uid),
      where("status", "==", "pending")
    );

    const sentSnapshot = await getDocs(sentQuery);

    console.log("STEP 6");

    if (!sentSnapshot.empty) {
      throw new Error("Friend request already sent.");
    }

    console.log("STEP 7");

    // =====================================
    // Pending request from them?
    // =====================================

    const receivedQuery = query(
      collection(db, "friendRequests"),
      where("fromUid", "==", toUser.uid),
      where("toUid", "==", fromUser.uid),
      where("status", "==", "pending")
    );

    const receivedSnapshot = await getDocs(
      receivedQuery
    );

    console.log("STEP 8");

    if (!receivedSnapshot.empty) {
      throw new Error(
        "This user has already sent you a friend request."
      );
    }

    console.log("STEP 9");

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

    console.log("STEP 10");
    console.log("Friend Request Sent Successfully");

  } catch (error) {

    console.error("FAILED AT:", error);
    throw error;

  }

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

// _________________________________________________________
// __________________________________________________
/* ======================================
   GET MY FRIENDS
====================================== */

export async function getFriends(currentUser) {

    try {

        const q = query(

            collection(db, "friends"),

            where("users", "array-contains", currentUser.uid)

        );

        const snapshot = await getDocs(q);

        const friends = [];

        snapshot.forEach((document) => {

            const data = document.data();

            if (data.user1.uid === currentUser.uid) {

                friends.push(data.user2);

            }

            else {

                friends.push(data.user1);

            }

        });

        return friends;

    }

    catch (error) {

        console.log(error);

        throw error;

    }

}