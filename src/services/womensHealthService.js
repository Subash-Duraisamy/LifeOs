import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* ===========================================
   CREATE NEW CYCLE
=========================================== */

export async function createCycle(uid, data) {

    return await addDoc(

        collection(db, "womenCycles"),

        {

            uid,

            startDate: data.startDate,

            endDate: data.endDate || null,

            cycleLength: data.cycleLength,

            periodLength: data.periodLength,

            status: data.status || "ACTIVE",

            deleted: false,

            createdAt: serverTimestamp(),

            updatedAt: serverTimestamp(),

        }

    );

}

/* ===========================================
   GET CURRENT ACTIVE CYCLE
=========================================== */

export async function getCurrentCycle(uid) {

    const q = query(

        collection(db, "womenCycles"),

        where("uid", "==", uid),

        where("status", "==", "ACTIVE"),

        where("deleted", "==", false),

        limit(1)

    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        return null;

    }

    return {

        id: snapshot.docs[0].id,

        ...snapshot.docs[0].data(),

    };

}

/* ===========================================
   GET ALL CYCLES
=========================================== */

export async function getCycleHistory(uid) {

    const q = query(

        collection(db, "womenCycles"),

        where("uid", "==", uid),

        where("deleted", "==", false),

        orderBy("createdAt", "desc")

    );

    const snapshot = await getDocs(q);

    const cycles = [];

    snapshot.forEach((document)=>{

        cycles.push({

            id: document.id,

            ...document.data(),

        });

    });

    return cycles;

}

/* ===========================================
   UPDATE CYCLE
=========================================== */

export async function updateCycle(id, data){

    await updateDoc(

        doc(db,"womenCycles",id),

        {

            ...data,

            updatedAt: serverTimestamp(),

        }

    );

}

/* ===========================================
   END PERIOD
=========================================== */

export async function endPeriod(id,endDate){

    await updateDoc(

        doc(db,"womenCycles",id),

        {

            endDate,

            status:"COMPLETED",

            updatedAt:serverTimestamp(),

        }

    );

}

/* ===========================================
   DELETE CYCLE (SOFT DELETE)
=========================================== */

export async function deleteCycle(id){

    await updateDoc(

        doc(db,"womenCycles",id),

        {

            deleted:true,

            updatedAt:serverTimestamp(),

        }

    );

}

/* ===========================================
   RESTORE CYCLE
=========================================== */

export async function restoreCycle(id){

    await updateDoc(

        doc(db,"womenCycles",id),

        {

            deleted:false,

            updatedAt:serverTimestamp(),

        }

    );

}

/* ===========================================
   PERMANENT DELETE
=========================================== */

export async function removeCycle(id){

    await deleteDoc(

        doc(db,"womenCycles",id)

    );

}

/* ===========================================
   START PERIOD
=========================================== */

export async function startPeriod(

    uid,

    cycleLength,

    periodLength

){

    return await createCycle(

        uid,

        {

            startDate:new Date(),

            cycleLength,

            periodLength,

            status:"ACTIVE",

        }

    );

}

/* ===========================================
   SAVE DAILY JOURNAL
=========================================== */

export async function saveDailyJournal(

    uid,

    cycleId,

    data

){

    return await addDoc(

        collection(db,"cycleDailyLogs"),

        {

            uid,

            cycleId,

            date:data.date,

            flow:data.flow,

            pain:data.pain,

            mood:data.mood,

            symptoms:data.symptoms,

            water:data.water,

            sleep:data.sleep,

            exercise:data.exercise,

            medicine:data.medicine,

            medicineName:data.medicineName,

            notes:data.notes,

            createdAt:serverTimestamp(),

            updatedAt:serverTimestamp(),

        }

    );

}

/* ===========================================
   GET TODAY JOURNAL
=========================================== */

export async function getTodayJournal(

    uid,

    cycleId,

    date

){

    const q=query(

        collection(db,"cycleDailyLogs"),

        where("uid","==",uid),

        where("cycleId","==",cycleId),

        where("date","==",date),

        limit(1)

    );

    const snapshot=await getDocs(q);

    if(snapshot.empty){

        return null;

    }

    return{

        id:snapshot.docs[0].id,

        ...snapshot.docs[0].data(),

    };

}

/* ===========================================
   UPDATE JOURNAL
=========================================== */

export async function updateDailyJournal(

    id,

    data

){

    await updateDoc(

        doc(db,"cycleDailyLogs",id),

        {

            ...data,

            updatedAt:serverTimestamp(),

        }

    );

}

/* ===========================================
   DELETE JOURNAL
=========================================== */

export async function deleteDailyJournal(id){

    await deleteDoc(

        doc(db,"cycleDailyLogs",id)

    );

}

/* ===========================================
   GET ALL JOURNALS OF A CYCLE
=========================================== */

export async function getCycleJournal(

    uid,

    cycleId

){

    const q=query(

        collection(db,"cycleDailyLogs"),

        where("uid","==",uid),

        where("cycleId","==",cycleId),

        orderBy("date","asc")

    );

    const snapshot=await getDocs(q);

    const logs=[];

    snapshot.forEach((document)=>{

        logs.push({

            id:document.id,

            ...document.data(),

        });

    });

    return logs;

}