import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getUser } from "./authService";

import { db } from "../firebase/firebase";

import { getTasks } from "./taskService";
import { getLibrary } from "./libraryService";

/* =====================================
   FRIEND DASHBOARD
===================================== */

export async function getFriendsDashboard(uid) {

  const friendshipQuery = query(
    collection(db, "friends"),
    where("users", "array-contains", uid)
  );

  const friendshipSnapshot = await getDocs(friendshipQuery);

  const today = new Date().toISOString().split("T")[0];

  const friends = [];

  for (const friendship of friendshipSnapshot.docs) {

    const data = friendship.data();

    console.log("================================");
    console.log("Document ID:", friendship.id);
    console.log(data);

    // Skip invalid friendship documents
    if (!data.user1 || !data.user2) {

      console.error(
        "INVALID FRIEND DOCUMENT:",
        friendship.id
      );

      continue;

    }

    let friend;

    if (data.user1.uid === uid) {

      friend = data.user2;

    } else if (data.user2.uid === uid) {

      friend = data.user1;

    } else {

      console.log(
        "Current user not found in friendship:",
        friendship.id
      );

      continue;

    }

    // -----------------------------
    // Today's Tasks
    // -----------------------------

    const allTasks = await getTasks(friend.uid);

    const todaysTasks = allTasks.filter(
      task => task.startDate === today
    );

    // -----------------------------
    // Library
    // -----------------------------

    const library = await getLibrary(friend.uid);

    const currentBook =
      library.find(
        item =>
          item.type === "book" &&
          item.current
      ) || null;

    const currentMovie =
      library.find(
        item =>
          item.type === "movie" &&
          item.current
      ) || null;

    const currentCourse =
      library.find(
        item =>
          item.type === "course" &&
          item.current
      ) || null;

// Get latest profile from users collection
const latestProfile = await getUser(friend.uid);

friends.push({
  uid: friend.uid,

  fullName:
    latestProfile?.fullName || friend.fullName,

  username:
    latestProfile?.username || friend.username,

  photoURL:
    latestProfile?.photoURL ||
    friend.photoURL ||
    "",

  todaysTasks,

  currentBook,

  currentMovie,

  currentCourse,
});

  }

  return friends;

}