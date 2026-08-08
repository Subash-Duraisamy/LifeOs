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
