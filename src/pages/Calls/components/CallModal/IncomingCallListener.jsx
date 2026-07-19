import { useEffect, useState } from "react";

import {
    collection,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import { db } from "../../../../firebase/firebase";

import { useAuth } from "../../../../hooks/useAuth";

import {
    acceptCall,
    rejectCall,
} from "../../../../services/callService";

import IncomingCall from "./IncomingCall";

function IncomingCallListener() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [incomingCall, setIncomingCall] = useState(null);

    useEffect(() => {

        if (!user) return;

        const q = query(

            collection(db, "calls"),

            where("receiverId", "==", user.uid),

            where("status", "==", "ringing")

        );

        const unsubscribe = onSnapshot(

            q,

            (snapshot) => {

                if (snapshot.empty) {

                    setIncomingCall(null);

                    return;

                }

                const doc = snapshot.docs[0];

                setIncomingCall({

                    id: doc.id,

                    ...doc.data(),

                });

            }

        );

        return unsubscribe;

    }, [user]);

    async function handleAccept() {

        if (!incomingCall) return;

        try {

            await acceptCall(incomingCall.id);

            navigate(`/calls/${incomingCall.id}`);

        }

        catch (error) {

            console.error(error);

        }

    }

    async function handleReject() {

        if (!incomingCall) return;

        try {

            await rejectCall(incomingCall.id);

            setIncomingCall(null);

        }

        catch (error) {

            console.error(error);

        }

    }

    if (!incomingCall) {

        return null;

    }

    return (

        <IncomingCall

            call={incomingCall}

            onAccept={handleAccept}

            onReject={handleReject}

        />

    );

}

export default IncomingCallListener;