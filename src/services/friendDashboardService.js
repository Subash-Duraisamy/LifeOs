import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import { getTasks } from "./taskService";
import { getLibrary } from "./libraryService";

/* =====================================
   FRIEND DASHBOARD
===================================== */
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

    const friendshipData = friendship.data();

    // ===============================
    // Get Friend UID
    // ===============================

    const friendUid =
      friendshipData.user1.uid === uid
        ? friendshipData.user2.uid
        : friendshipData.user1.uid;

    // ===============================
    // Fetch Latest User Profile
    // ===============================

    const userSnapshot = await getDoc(
      doc(db, "users", friendUid)
    );

    if (!userSnapshot.exists()) {
      continue;
    }

    const friend = userSnapshot.data();

    // ===============================
    // Today's Tasks
    // ===============================

    const allTasks = await getTasks(friend.uid);

    const todaysTasks = allTasks.filter(
      (task) => task.startDate === today
    );

    // ===============================
    // Library
    // ===============================

    const library = await getLibrary(friend.uid);

    const currentBook =
      library.find(
        (item) =>
          item.type === "book" &&
          item.current
      ) || null;

    const currentMovie =
      library.find(
        (item) =>
          item.type === "movie" &&
          item.current
      ) || null;

    const currentCourse =
      library.find(
        (item) =>
          item.type === "course" &&
          item.current
      ) || null;

    // ===============================
    // Push Friend
    // ===============================

    friends.push({

      uid: friend.uid,

      fullName: friend.fullName,

      username: friend.username,

      photoURL: friend.photoURL || "",

      bio: friend.bio || "",

      todaysTasks,

      currentBook,

      currentMovie,

      currentCourse,

    });

  }

  return friends;

}