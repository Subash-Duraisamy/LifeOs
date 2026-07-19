import {
    addDoc,
    collection,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    onSnapshot,
    setDoc,
    getDoc,
    getDocs,
    addDoc as addCandidate,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* ==========================================
   CREATE CALL
========================================== */

export async function createCall({

    caller,

    receiver,

    type,

}) {

    const callRef = await addDoc(

        collection(db, "calls"),

        {

            callerId: caller.uid,

            callerName: caller.fullName,

            callerPhoto: caller.photoURL || "",

            receiverId: receiver.friendUid,

            receiverName: receiver.friendName,

            receiverPhoto: receiver.friendPhoto || "",

            type,

            status: "ringing",

            createdAt: serverTimestamp(),

            acceptedAt: null,

            endedAt: null,

            offer: null,

            answer: null,

            muted: false,

            cameraOff: false,

            screenSharing: false,

        }

    );

    return callRef.id;

}
/* ==========================================
   SAVE SDP OFFER
========================================== */

export async function saveOffer(

    callId,

    offer

) {

    await updateDoc(

        doc(db, "calls", callId),

        {

            offer,

        }

    );

}

/* ==========================================
   SAVE SDP ANSWER
========================================== */

export async function saveAnswer(

    callId,

    answer

) {

    await updateDoc(

        doc(db, "calls", callId),

        {

            answer,

        }

    );

}
/* ==========================================
   ADD OFFER ICE CANDIDATE
========================================== */

export async function addOfferCandidate(

    callId,

    candidate

) {

    await addCandidate(

        collection(

            db,

            "calls",

            callId,

            "offerCandidates"

        ),

        candidate

    );

}

/* ==========================================
   ADD ANSWER ICE CANDIDATE
========================================== */

export async function addAnswerCandidate(

    callId,

    candidate

) {

    await addCandidate(

        collection(

            db,

            "calls",

            callId,

            "answerCandidates"

        ),

        candidate

    );

}
/* ==========================================
   LISTEN OFFER ICE CANDIDATES
========================================== */

export function listenOfferCandidates(

    callId,

    callback

) {

    return onSnapshot(

        collection(

            db,

            "calls",

            callId,

            "offerCandidates"

        ),

        (snapshot) => {

            snapshot.docChanges().forEach((change) => {

                if (change.type === "added") {

                    callback(change.doc.data());

                }

            });

        }

    );

}

/* ==========================================
   LISTEN ANSWER ICE CANDIDATES
========================================== */

export function listenAnswerCandidates(

    callId,

    callback

) {

    return onSnapshot(

        collection(

            db,

            "calls",

            callId,

            "answerCandidates"

        ),

        (snapshot) => {

            snapshot.docChanges().forEach((change) => {

                if (change.type === "added") {

                    callback(change.doc.data());

                }

            });

        }

    );

}
/* ==========================================
   MUTE
========================================== */

export async function updateMute(

    callId,

    muted

) {

    await updateDoc(

        doc(db, "calls", callId),

        {

            muted,

        }

    );

}

/* ==========================================
   CAMERA
========================================== */

export async function updateCamera(

    callId,

    cameraOff

) {

    await updateDoc(

        doc(db, "calls", callId),

        {

            cameraOff,

        }

    );

}

/* ==========================================
   SCREEN SHARE
========================================== */

export async function updateScreenSharing(

    callId,

    enabled

) {

    await updateDoc(

        doc(db, "calls", callId),

        {

            screenSharing: enabled,

        }

    );

}

/* ==========================================
   REALTIME CALL LISTENER
========================================== */

export function listenCall(

    callId,

    callback

) {

    return onSnapshot(

        doc(db, "calls", callId),

        (snapshot) => {

            if (!snapshot.exists()) {

                callback(null);

                return;

            }

            callback({

                id: snapshot.id,

                ...snapshot.data(),

            });

        }

    );

}

/* ==========================================
   GET CALL
========================================== */

export async function getCall(

    callId

) {

    const snapshot = await getDoc(

        doc(db, "calls", callId)

    );

    if (!snapshot.exists()) {

        return null;

    }

    return {

        id: snapshot.id,

        ...snapshot.data(),

    };


    
}

/* ==========================================
   ACCEPT CALL
========================================== */

export async function acceptCall(callId) {

    await updateDoc(

        doc(db, "calls", callId),

        {

            status: "accepted",

            acceptedAt: serverTimestamp(),

        }

    );

}


/* ==========================================
   REJECT CALL
========================================== */

export async function rejectCall(callId) {

    await updateDoc(

        doc(db, "calls", callId),

        {

            status: "rejected",

            endedAt: serverTimestamp(),

        }

    );

}


/* ==========================================
   END CALL
========================================== */

export async function endCall(callId) {

    await updateDoc(

        doc(db, "calls", callId),

        {

            status: "ended",

            endedAt: serverTimestamp(),

        }

    );

}