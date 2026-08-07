import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import {
  
  
  query,
  where,
} from "firebase/firestore";


import { db } from "../firebase/firebase";


/* =========================================
   LOAD ALL DAYS
========================================= */

export async function loadCalendarRecords(uid) {

  const q = query(
    collection(db, "calendar"),
    where("uid", "==", uid)
  );

  const snapshot = await getDocs(q);

  const records = {};

  snapshot.forEach((doc) => {

    const data = doc.data();

    records[data.date] = data;

  });

  return records;

}

/* =========================================
   LOAD DAY
========================================= */

export async function loadDayRecord(

  uid,

  dateKey

) {

  const documentId = `${uid}_${dateKey}`;

  const documentRef = doc(

    db,

    "calendar",

    documentId

  );

  const snapshot = await getDoc(

    documentRef

  );

  if (!snapshot.exists()) {

    return null;

  }

  return snapshot.data();

}

/* =========================================
   SAVE DAY
========================================= */

export async function saveDayRecord(

  uid,

  dateKey,

  data

) {

  const documentId = `${uid}_${dateKey}`;

  const documentRef = doc(

    db,

    "calendar",

    documentId

  );

  await setDoc(

    documentRef,

    {

      uid,

      date: dateKey,

      ...data,

    },

    {

      merge: true,

    }

  );

}

/* =========================================
   GET CURRENT STREAK
========================================= */

export async function getCurrentStreak(uid) {

  const q = query(
    collection(db, "calendar"),
    where("uid", "==", uid)
  );

  const snapshot = await getDocs(q);

  const records = snapshot.docs
    .map(doc => doc.data())
    .filter(record => record.submitted);

  if (records.length === 0) {
    return 0;
  }

  records.sort((a, b) => b.date.localeCompare(a.date));

  let streak = 0;

  let currentDate = new Date();

  while (true) {

    const key = currentDate.toLocaleDateString("en-CA");

    const found = records.find(
      item => item.date === key
    );

    if (!found) {
      break;
    }

    streak++;

    currentDate.setDate(
      currentDate.getDate() - 1
    );

  }

  return streak;

}