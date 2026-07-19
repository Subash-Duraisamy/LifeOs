import { useCallback } from "react";

import {
    saveOffer,
    saveAnswer,
    addCallerCandidate,
    addReceiverCandidate,
} from "../../../services/callService";

function useCall({

    call,

    callId,

    peerConnection,

    createOffer,

    createAnswer,

    setRemoteAnswer,

    addIceCandidate,

}) {

    /* ==========================================
       START CALL (CALLER)
    ========================================== */

    const startCall = useCallback(async () => {

        if (!call) return;

        if (call.offer) return;

        const offer = await createOffer();

        await saveOffer(

            callId,

            offer

        );

    }, [

        call,

        callId,

        createOffer,

    ]);

    /* ==========================================
       JOIN CALL (RECEIVER)
    ========================================== */

    const joinCall = useCallback(async () => {

        if (!call) return;

        if (!call.offer) return;

        if (call.answer) return;

        const answer = await createAnswer(

            call.offer

        );

        await saveAnswer(

            callId,

            answer

        );

    }, [

        call,

        callId,

        createAnswer,

    ]);

    /* ==========================================
       RECEIVE ANSWER
    ========================================== */

    const receiveAnswer = useCallback(async () => {

        if (!call) return;

        if (!call.answer) return;

        if (

            peerConnection.current?.currentRemoteDescription

        ) {

            return;

        }

        await setRemoteAnswer(

            call.answer

        );

    }, [

        call,

        peerConnection,

        setRemoteAnswer,

    ]);

    /* ==========================================
       SEND ICE
    ========================================== */

    const sendIceCandidate = useCallback(

        async (candidate) => {

            if (!call) return;

            if (!candidate) return;

            if (

                call.callerId === call.receiverId

            ) {

                return;

            }

            if (

                call.callerId ===

                peerConnection.current?.localUserId

            ) {

                await addCallerCandidate(

                    callId,

                    candidate.toJSON()

                );

            }

            else {

                await addReceiverCandidate(

                    callId,

                    candidate.toJSON()

                );

            }

        },

        [

            call,

            callId,

            peerConnection,

        ]

    );

    /* ==========================================
       RECEIVE ICE
    ========================================== */

    const receiveIceCandidates = useCallback(async () => {

        if (!call) return;

        if (

            call.callerCandidates

        ) {

            for (

                const candidate

                of call.callerCandidates

            ) {

                await addIceCandidate(

                    candidate

                );

            }

        }

        if (

            call.receiverCandidates

        ) {

            for (

                const candidate

                of call.receiverCandidates

            ) {

                await addIceCandidate(

                    candidate

                );

            }

        }

    }, [

        call,

        addIceCandidate,

    ]);

    return {

        startCall,

        joinCall,

        receiveAnswer,

        sendIceCandidate,

        receiveIceCandidates,

    };

}

export default useCall;