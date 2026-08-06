import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

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

  const friendshipSnapshot =
    await getDocs(friendshipQuery);

  const today =
    new Date().toISOString().split("T")[0];

  const friends = [];

  for (const friendship of friendshipSnapshot.docs) {

    const data = friendship.data();

    const friend =
      data.user1.uid === uid
        ? data.user2
        : data.user1;

    // -----------------------------
    // Today's Tasks
    // -----------------------------

    const allTasks =
      await getTasks(friend.uid);

    const todaysTasks =
      allTasks.filter(
        task =>
          task.startDate === today
      );

    // -----------------------------
    // Library
    // -----------------------------

    const library =
      await getLibrary(friend.uid);

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

    friends.push({

      uid: friend.uid,

      fullName: friend.fullName,

      username: friend.username,

      photoURL: friend.photoURL || "",

      todaysTasks,

      currentBook,

      currentMovie,

      currentCourse,

    });

  }

  return friends;

}