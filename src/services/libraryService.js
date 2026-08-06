import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const COLLECTION = "library";

/* ==========================================
   GET ALL LIBRARY ITEMS
========================================== */

export async function getLibrary(uid) {

  const q = query(
    collection(db, COLLECTION),
    where("uid", "==", uid),
    orderBy("type"),
    orderBy("order")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* ==========================================
   ADD ITEM
========================================== */

export async function addLibraryItem(uid, data) {

  await addDoc(
    collection(db, COLLECTION),
    {
      uid,

      title: data.title,

      image: data.image,

      type: data.type,

      current: data.current,

      order: data.order ?? 0,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    }
  );

}

/* ==========================================
   UPDATE ITEM
========================================== */

export async function updateLibraryItem(id, data) {

  await updateDoc(
    doc(db, COLLECTION, id),
    {
      ...data,
      updatedAt: serverTimestamp(),
    }
  );

}

/* ==========================================
   DELETE ITEM
========================================== */

export async function deleteLibraryItem(id) {

  await deleteDoc(
    doc(db, COLLECTION, id)
  );

}