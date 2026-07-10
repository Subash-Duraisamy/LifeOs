import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* ===========================================
   GET VAULT
=========================================== */

export async function getVault(uid) {

  const snapshot = await getDoc(
    doc(db, "vault", uid)
  );

  if (!snapshot.exists()) {

    return null;

  }

  return snapshot.data();

}

/* ===========================================
   CREATE VAULT
=========================================== */

export async function createVault(
  uid,
  data
) {

  await setDoc(
    doc(db, "vault", uid),
    {

      ...data,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),

    }
  );

}

/* ===========================================
   UPDATE VAULT
=========================================== */

export async function updateVault(
  uid,
  data
) {

  await updateDoc(
    doc(db, "vault", uid),
    {

      ...data,

      updatedAt: serverTimestamp(),

    }
  );

}