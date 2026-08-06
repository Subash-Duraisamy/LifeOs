import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* ===========================================
   GET ALL CREDENTIALS
=========================================== */

export async function getCredentials(uid) {

  const q = query(
    collection(db, "credentials"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  const credentials = [];

  snapshot.forEach((document) => {

    credentials.push({

      id: document.id,

      ...document.data(),

    });

  });

  return credentials;

}

/* ===========================================
   ADD CREDENTIAL
=========================================== */

export async function addCredential(
  uid,
  data
) {

  await addDoc(
    collection(db, "credentials"),
    {

      uid,

      appName: data.appName,

      website: data.website,

      username: data.username,

      password: data.password,

      notes: data.notes,

      category: data.category,

      favorite: data.favorite,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),

    }
  );

}

/* ===========================================
   UPDATE CREDENTIAL
=========================================== */

export async function updateCredential(
  id,
  data
) {

  await updateDoc(
    doc(db, "credentials", id),
    {

      appName: data.appName,

      website: data.website,

      username: data.username,

      password: data.password,

      notes: data.notes,

      category: data.category,

      favorite: data.favorite,

      updatedAt: serverTimestamp(),

    }
  );

}

/* ===========================================
   DELETE CREDENTIAL
=========================================== */

export async function deleteCredential(id) {

  await deleteDoc(
    doc(db, "credentials", id)
  );

}