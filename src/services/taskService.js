import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* -------------------------------
   CREATE TASK
-------------------------------- */

export async function createTask(uid, task) {

  try {

    console.log("========== CREATE TASK ==========");
    console.log("UID:", uid);
    console.log("Task:", task);

    const docRef = await addDoc(
      collection(db, "tasks"),
      {
        uid,

        title: task.title || "",

        description: task.description || "",

        priority: task.priority || "Medium",

        category: task.category || "Personal",

        startDate: task.startDate || "",

        endDate: task.endDate || "",

        startTime: task.startTime || "",

        endTime: task.endTime || "",

        repeat: task.repeat || "Never",

        linkName: task.linkName || "",

        url: task.url || "",

        assignMember: task.assignMember || "",

        tags: task.tags || "",

        notes: task.notes || "",

        completed: false,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),

      }
    );

    console.log("Task Created:", docRef.id);

    return docRef.id;

  } catch (error) {

    console.error("CREATE TASK ERROR");
    console.error(error);

    throw error;

  }

}

/* -------------------------------
   GET ALL TASKS OF USER
-------------------------------- */

export async function getTasks(uid) {

  try {

    const q = query(

      collection(db, "tasks"),

      where("uid", "==", uid),

      orderBy("createdAt", "desc")

    );

    const snapshot = await getDocs(q);

    const tasks = snapshot.docs.map((doc) => ({

      id: doc.id,

      ...doc.data(),

    }));

    return tasks;

  } catch (error) {

    console.error("GET TASKS ERROR");
    console.error(error);

    throw error;

  }

}

/* -------------------------------
   GET SINGLE TASK
-------------------------------- */

export async function getTaskById(taskId) {

  try {

    const taskRef = doc(db, "tasks", taskId);

    const snapshot = await getDoc(taskRef);

    if (!snapshot.exists()) {

      return null;

    }

    return {

      id: snapshot.id,

      ...snapshot.data(),

    };

  } catch (error) {

    console.error("GET TASK BY ID ERROR");
    console.error(error);

    throw error;

  }

}

/* -------------------------------
   UPDATE TASK
-------------------------------- */

export async function updateTask(taskId, data) {

  try {

    const taskRef = doc(db, "tasks", taskId);

    await updateDoc(taskRef, {

      title: data.title,

      description: data.description,

      priority: data.priority,

      category: data.category,

      startDate: data.startDate,

      endDate: data.endDate,

      startTime: data.startTime,

      endTime: data.endTime,

      repeat: data.repeat,

      linkName: data.linkName,

      url: data.url,

      assignMember: data.assignMember,

      tags: data.tags,

      notes: data.notes,

      updatedAt: serverTimestamp(),

    });

    console.log("Task Updated");

  } catch (error) {

    console.error("UPDATE TASK ERROR");
    console.error(error);

    throw error;

  }

}

/* -------------------------------
   TOGGLE TASK COMPLETE
-------------------------------- */

export async function toggleTask(taskId, completed) {

  try {

    const taskRef = doc(db, "tasks", taskId);

    await updateDoc(taskRef, {

      completed,

      updatedAt: serverTimestamp(),

    });

    console.log("Task Completion Updated");

  } catch (error) {

    console.error("TOGGLE TASK ERROR");
    console.error(error);

    throw error;

  }

}

/* -------------------------------
   DELETE TASK
-------------------------------- */

export async function deleteTask(taskId) {

  try {

    await deleteDoc(
      doc(db, "tasks", taskId)
    );

    console.log("Task Deleted");

  } catch (error) {

    console.error("DELETE TASK ERROR");
    console.error(error);

    throw error;

  }

}