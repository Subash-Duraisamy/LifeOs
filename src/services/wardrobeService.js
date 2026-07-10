import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const defaultWardrobe = {

  pants: {
    Jeans: 0,
    Baggy: 0,
    Cargo: 0,
    Parallel: 0,
    Joggers: 0,
    Formal: 0,
    Chinos: 0,
  },

  shirts: {
    Formal: 0,
    Casual: 0,
    Linen: 0,
    Flannel: 0,
  },

  tshirts: {
    Oversized: 0,
    "Round Neck": 0,
    Polo: 0,
    Henley: 0,
    VNeck: 0,
  },

  hoodies: {
    Black: 0,
    White: 0,
    Printed: 0,
  },

  shoes: {
    Sneakers: 0,
    Running: 0,
    Formal: 0,
    Slippers: 0,
    Sandals: 0,
  },

  accessories: {
    Watch: 0,
    Belt: 0,
    Cap: 0,
    Sunglasses: 0,
    Wallet: 0,
  },

};

export async function getWardrobe(uid) {

  const ref = doc(db, "wardrobes", uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) {

    await setDoc(ref, defaultWardrobe);

    return defaultWardrobe;

  }

  return snap.data();

}

export async function saveWardrobe(uid, wardrobe) {

  const ref = doc(db, "wardrobes", uid);

  await updateDoc(ref, wardrobe);

}