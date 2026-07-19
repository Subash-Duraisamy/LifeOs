import { useEffect, useRef, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import IncomingCall from "./components/CallModal/IncomingCall";
import OutgoingCall from "./components/CallModal/OutgoingCall";

import {

    acceptCall,

    rejectCall,

    endCall,

    saveOffer,

    saveAnswer,

    listenCall,

    addOfferCandidate,

    addAnswerCandidate,

    listenOfferCandidates,

    listenAnswerCandidates,

} from "../../services/callService";

import usePeerConnection from "./hooks/usePeerConnection";

import "./CallPage.css";

function CallPage() {

    const { callId } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();

    const localVideoRef = useRef(null);

    const remoteVideoRef = useRef(null);

    const [call, setCall] = useState(null);

    const [loading, setLoading] = useState(true);

    const [localStream, setLocalStream] = useState(null);

    const [cameraEnabled, setCameraEnabled] = useState(true);

    const [micEnabled, setMicEnabled] = useState(true);

    const isCaller =

        user?.uid === call?.callerId;

    const isReceiver =

        user?.uid === call?.receiverId;

    const {

        peerConnection,

        createPeerConnection,

        createOffer,

        createAnswer,

        setRemoteOffer,

        setRemoteAnswer,

        addIceCandidate,

        closeConnection,

    } = usePeerConnection();

    /* ==========================================
   LOAD CAMERA
========================================== */

useEffect(() => {

    async function loadMedia() {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({

                    video: true,

                    audio: true,

                });

            setLocalStream(stream);

            if (localVideoRef.current) {

                localVideoRef.current.srcObject = stream;

            }

        }

        catch (err) {

            console.error(

                "Camera Error",

                err

            );

        }

    }

    loadMedia();

}, []);


/* ==========================================
   LISTEN CALL
========================================== */

useEffect(() => {

    if (!callId) return;

    const unsubscribe = listenCall(

        callId,

        (data) => {

            if (!data) {

                navigate("/friends");

                return;

            }

            setCall(data);

            setLoading(false);

        }

    );

    return () => {

        if (unsubscribe) {

            unsubscribe();

        }

    };

}, [

    callId,

    navigate,

]);


/* ==========================================
   CREATE PEER CONNECTION
========================================== */

useEffect(() => {

    if (

        !localStream ||

        peerConnection.current

    ) {

        return;

    }

    createPeerConnection(

        localStream,

        remoteVideoRef,

        async (candidate) => {

            if (!callId) return;

            if (!candidate) return;

            if (isCaller) {

                await addOfferCandidate(

                    callId,

                    candidate

                );

            }

            if (isReceiver) {

                await addAnswerCandidate(

                    callId,

                    candidate

                );

            }

        }

    );

}, [

    localStream,

    callId,

    isCaller,

    isReceiver,

    createPeerConnection,

]);
/* ==========================================
   CREATE OFFER (CALLER ONLY)
========================================== */

useEffect(() => {

    async function createCallOffer() {

        if (

            !call ||

            !peerConnection.current ||

            !isCaller

        ) {

            return;

        }

        if (

            call.offer ||

            call.status !== "ringing"

        ) {

            return;

        }

        try {

            const offer = await createOffer();

            if (offer) {

                await saveOffer(

                    call.id,

                    offer

                );

            }

        }

        catch (err) {

            console.error(

                "Offer Error",

                err

            );

        }

    }

    createCallOffer();

}, [

    call,

    isCaller,

    createOffer,

]);


/* ==========================================
   APPLY REMOTE OFFER (RECEIVER)
========================================== */

useEffect(() => {

    async function applyRemoteOffer() {

        if (

            !call ||

            !peerConnection.current ||

            !isReceiver ||

            !call.offer

        ) {

            return;

        }

        try {

            await setRemoteOffer(

                call.offer

            );

        }

        catch (err) {

            console.error(

                "Remote Offer Error",

                err

            );

        }

    }

    applyRemoteOffer();

}, [

    call,

    isReceiver,

    setRemoteOffer,

]);


/* ==========================================
   CREATE ANSWER (RECEIVER)
========================================== */

useEffect(() => {

    async function createCallAnswer() {

        if (

            !call ||

            !peerConnection.current ||

            !isReceiver ||

            !call.offer ||

            call.answer

        ) {

            return;

        }

        try {

            const answer =

                await createAnswer(

                    call.offer

                );

            if (answer) {

                await saveAnswer(

                    call.id,

                    answer

                );

            }

        }

        catch (err) {

            console.error(

                "Answer Error",

                err

            );

        }

    }

    createCallAnswer();

}, [

    call,

    isReceiver,

    createAnswer,

]);


/* ==========================================
   APPLY REMOTE ANSWER (CALLER)
========================================== */

useEffect(() => {

    async function applyRemoteAnswer() {

        if (

            !call ||

            !peerConnection.current ||

            !isCaller ||

            !call.answer

        ) {

            return;

        }

        try {

            await setRemoteAnswer(

                call.answer

            );

        }

        catch (err) {

            console.error(

                "Remote Answer Error",

                err

            );

        }

    }

    applyRemoteAnswer();

}, [

    call,

    isCaller,

    setRemoteAnswer,

]);


/* ==========================================
   LISTEN OFFER CANDIDATES
========================================== */

useEffect(() => {

    if (

        !callId ||

        !isReceiver

    ) {

        return;

    }

    return listenOfferCandidates(

        callId,

        async (candidate) => {

            await addIceCandidate(

                candidate

            );

        }

    );

}, [

    callId,

    isReceiver,

    addIceCandidate,

]);


/* ==========================================
   LISTEN ANSWER CANDIDATES
========================================== */

useEffect(() => {

    if (

        !callId ||

        !isCaller

    ) {

        return;

    }

    return listenAnswerCandidates(

        callId,

        async (candidate) => {

            await addIceCandidate(

                candidate

            );

        }

    );

}, [

    callId,

    isCaller,

    addIceCandidate,

]);
/* ==========================================
   CALL ACTIONS
========================================== */

async function acceptHandler() {

    if (!call) return;

    try {

        await acceptCall(

            call.id

        );

    }

    catch (err) {

        console.error(

            err

        );

    }

}

async function rejectHandler() {

    if (!call) return;

    try {

        await rejectCall(

            call.id

        );

    }

    catch (err) {

        console.error(

            err

        );

    }

    closeConnection();

    if (localStream) {

        localStream

            .getTracks()

            .forEach(track => track.stop());

    }

    navigate("/friends");

}

async function endHandler() {

    if (!call) return;

    try {

        await endCall(

            call.id

        );

    }

    catch (err) {

        console.error(

            err

        );

    }

    closeConnection();

    if (localStream) {

        localStream

            .getTracks()

            .forEach(track => track.stop());

    }

    navigate("/friends");

}


/* ==========================================
   CAMERA
========================================== */

function toggleCamera() {

    if (!localStream) return;

    const track =

        localStream.getVideoTracks()[0];

    if (!track) return;

    track.enabled =

        !track.enabled;

    setCameraEnabled(

        track.enabled

    );

}


/* ==========================================
   MICROPHONE
========================================== */

function toggleMic() {

    if (!localStream) return;

    const track =

        localStream.getAudioTracks()[0];

    if (!track) return;

    track.enabled =

        !track.enabled;

    setMicEnabled(

        track.enabled

    );

}
/* ==========================================
   CLEANUP
========================================== */

useEffect(() => {

    return () => {

        closeConnection();

        if (localStream) {

            localStream

                .getTracks()

                .forEach(track => track.stop());

        }

    };

}, [

    localStream,

    closeConnection,

]);


if (loading) {

    return (

        <div className="call-loading">

            Loading Call...

        </div>

    );

}


return (

    <>

        {/* ==========================================
            RECEIVER POPUP
        ========================================== */}

        {

            call &&

            call.status === "ringing" &&

            isReceiver && (

                <IncomingCall

                    call={call}

                    onAccept={acceptHandler}

                    onReject={rejectHandler}

                />

            )

        }

        {/* ==========================================
            CALLER POPUP
        ========================================== */}

        {

            call &&

            call.status === "ringing" &&

            isCaller && (

                <OutgoingCall

                    call={call}

                    onCancel={endHandler}

                />

            )

        }

        {/* ==========================================
            MAIN CALL PAGE
        ========================================== */}

        <div className="call-page">

            <div className="call-container">

                <div className="call-header">

                    <div>

                        <h1>

                            📞 LifeOS Call

                        </h1>

                        <h2>

                            {

                                isCaller

                                    ? call.receiverName

                                    : call.callerName

                            }

                        </h2>

                        <p>

                            {call.type?.toUpperCase()} CALL

                        </p>

                    </div>

                    <div className="call-status">

                        {call.status}

                    </div>

                </div>

                <div className="call-preview">

                    <div className="video-box">

                        <video

                            ref={localVideoRef}

                            autoPlay

                            muted

                            playsInline

                            className="local-video"

                        />

                        <span>

                            You

                        </span>

                    </div>

                    <div className="video-box">

                        <video

                            ref={remoteVideoRef}

                            autoPlay

                            playsInline

                            className="remote-video"

                        />

                        <span>

                            {

                                isCaller

                                    ? call.receiverName

                                    : call.callerName

                            }

                        </span>

                    </div>

                </div>

                <div className="call-buttons">

                    <button

                        className="voice-btn"

                        onClick={toggleMic}

                    >

                        {

                            micEnabled

                                ? "🎤 Mute"

                                : "🔇 Unmute"

                        }

                    </button>

                    <button

                        className="video-btn"

                        onClick={toggleCamera}

                    >

                        {

                            cameraEnabled

                                ? "📹 Camera"

                                : "📷 Camera Off"

                        }

                    </button>

                    <button

                        className="screen-btn"

                    >

                        🖥 Share Screen

                    </button>

                    <button

                        className="chat-btn"

                    >

                        💬 Chat

                    </button>

                    <button

                        className="remove-btn"

                        onClick={endHandler}

                    >

                        ❌ End Call

                    </button>

                </div>

            </div>

        </div>

    </>

);

}

export default CallPage;