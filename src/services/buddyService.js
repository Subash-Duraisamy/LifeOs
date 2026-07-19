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
    serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* ===========================================
   SEND BUDDY REQUEST
=========================================== */

export async function sendBuddyRequest(

    femaleUser,

    maleUser

){

    const q = query(

        collection(db,"buddyRequests"),

        where("fromUid","==",femaleUser.uid),

        where("toUid","==",maleUser.uid),

        where("status","==","PENDING")

    );

    const snapshot = await getDocs(q);

    if(!snapshot.empty){

        throw new Error("Buddy request already sent.");

    }

    await addDoc(

        collection(db,"buddyRequests"),

        {

            fromUid: femaleUser.uid,

            fromName: femaleUser.fullName,

            fromPhoto: femaleUser.photoURL || "",

            toUid: maleUser.uid,

            toName: maleUser.fullName,

            toPhoto: maleUser.photoURL || "",

            status:"PENDING",

            createdAt:serverTimestamp(),

        }

    );

}

/* ===========================================
   GET MY REQUESTS
=========================================== */

export async function getBuddyRequests(uid){

    const q=query(

        collection(db,"buddyRequests"),

        where("toUid","==",uid)

    );

    const snapshot=await getDocs(q);

    const requests=[];

    snapshot.forEach(document=>{

        requests.push({

            id:document.id,

            ...document.data(),

        });

    });

    return requests;

}

/* ===========================================
   ACCEPT REQUEST
=========================================== */

export async function acceptBuddyRequest(

    request

){

    await updateDoc(

        doc(

            db,

            "buddyRequests",

            request.id

        ),

        {

            status:"ACCEPTED"

        }

    );

    await addDoc(

        collection(db,"buddyConnections"),

        {

            femaleUid:request.fromUid,

            maleUid:request.toUid,

            permissions:{

                showCurrentCycle:true,

                showNextPeriod:true,

                showOvulation:true,

                showPeriodStarted:true,

                showPeriodEnded:true,

                showDailyJournal:false,

                showMood:false,

                showSymptoms:false,

                showMedicine:false,

                showNotes:false,

            },

            createdAt:serverTimestamp(),

        }

    );

}

/* ===========================================
   REJECT REQUEST
=========================================== */

export async function rejectBuddyRequest(

    id

){

    await updateDoc(

        doc(db,"buddyRequests",id),

        {

            status:"REJECTED"

        }

    );

}

/* ===========================================
   REMOVE BUDDY
=========================================== */

export async function removeBuddy(connectionId){

    await deleteDoc(

        doc(

            db,

            "buddyConnections",

            connectionId

        )

    );

}

/* ===========================================
   GET MY BUDDY
=========================================== */

export async function getBuddy(uid){

    let q=query(

        collection(db,"buddyConnections"),

        where("femaleUid","==",uid)

    );

    let snapshot=await getDocs(q);

    if(!snapshot.empty){

        return{

            id:snapshot.docs[0].id,

            ...snapshot.docs[0].data(),

        };

    }

    q=query(

        collection(db,"buddyConnections"),

        where("maleUid","==",uid)

    );

    snapshot=await getDocs(q);

    if(!snapshot.empty){

        return{

            id:snapshot.docs[0].id,

            ...snapshot.docs[0].data(),

        };

    }

    return null;

}

/* ===========================================
   UPDATE PERMISSIONS
=========================================== */

export async function updateBuddyPermissions(

    connectionId,

    permissions

){

    await updateDoc(

        doc(

            db,

            "buddyConnections",

            connectionId

        ),

        {

            permissions,

        }

    );

}

/* ===========================================
   GET CONNECTION DETAILS
=========================================== */

export async function getBuddyConnection(

    femaleUid,

    maleUid

){

    const q=query(

        collection(db,"buddyConnections"),

        where("femaleUid","==",femaleUid),

        where("maleUid","==",maleUid)

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
   CHECK IF CONNECTED
=========================================== */

export async function isBuddy(

    femaleUid,

    maleUid

){

    const connection=

        await getBuddyConnection(

            femaleUid,

            maleUid

        );

    return connection!==null;

}