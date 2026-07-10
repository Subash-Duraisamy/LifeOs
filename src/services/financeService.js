import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* ==========================================
   COLLECTION
========================================== */

const financeCollection = collection(
  db,
  "finance"
);

/* ==========================================
   GET ALL TRANSACTIONS
========================================== */

export async function getTransactions(uid) {

  const q = query(

    financeCollection,

    where("uid", "==", uid),

    orderBy("date", "desc")

  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({

    id: item.id,

    ...item.data(),

  }));

}

/* ==========================================
   ADD TRANSACTION
========================================== */

export async function addTransaction(
  uid,
  transaction
) {

  await addDoc(

    financeCollection,

    {

      uid,

      ...transaction,

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),

    }

  );

}

/* ==========================================
   UPDATE TRANSACTION
========================================== */

export async function updateTransaction(
  uid,
  id,
  data
) {

  await updateDoc(

    doc(
      db,
      "finance",
      id
    ),

    {

      uid,

      ...data,

      updatedAt: serverTimestamp(),

    }

  );

}

/* ==========================================
   DELETE TRANSACTION
========================================== */

export async function deleteTransaction(
  uid,
  id
) {

  await deleteDoc(

    doc(
      db,
      "finance",
      id
    )

  );

}