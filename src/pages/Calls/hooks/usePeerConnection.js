import { useRef } from "react";

function usePeerConnection() {

    const peerConnection = useRef(null);

    const pendingCandidates = useRef([]);

    /* ==========================================
       CREATE PEER CONNECTION
    ========================================== */

    function createPeerConnection(

        localStream,

        remoteVideoRef,

        onIceCandidate

    ) {

        if (peerConnection.current) {

            return peerConnection.current;

        }

        const pc = new RTCPeerConnection({

            iceServers: [

                {

                    urls: [

                        "stun:stun.l.google.com:19302",

                        "stun:stun1.l.google.com:19302",

                    ],

                },

            ],

        });

        peerConnection.current = pc;

        /* ===============================
           LOCAL STREAM
        =============================== */

        if (localStream) {

            localStream.getTracks().forEach(track => {

                pc.addTrack(

                    track,

                    localStream

                );

            });

        }

        /* ===============================
           REMOTE STREAM
        =============================== */

        pc.ontrack = (event) => {

            console.log(

                "🎥 Remote stream received"

            );

            if (

                remoteVideoRef.current

            ) {

                remoteVideoRef.current.srcObject =

                    event.streams[0];

            }

        };

        /* ===============================
           ICE CANDIDATE
        =============================== */

        pc.onicecandidate = (event) => {

            if (

                event.candidate &&

                onIceCandidate

            ) {

                console.log(

                    "📡 Sending ICE Candidate"

                );

                onIceCandidate(

                    event.candidate.toJSON()

                );

            }

        };

        /* ===============================
           CONNECTION EVENTS
        =============================== */

        pc.onconnectionstatechange = () => {

            console.log(

                "Connection :",

                pc.connectionState

            );

        };

        pc.oniceconnectionstatechange = () => {

            console.log(

                "ICE :",

                pc.iceConnectionState

            );

        };

        pc.onsignalingstatechange = () => {

            console.log(

                "Signaling :",

                pc.signalingState

            );

        };

        return pc;

    }
        /* ==========================================
       CREATE OFFER
    ========================================== */

    async function createOffer() {

        if (!peerConnection.current) {

            return null;

        }

        if (

            peerConnection.current.signalingState !==

            "stable"

        ) {

            console.log(

                "Cannot create offer. Current state:",

                peerConnection.current.signalingState

            );

            return null;

        }

        const offer = await peerConnection.current.createOffer({

            offerToReceiveAudio: true,

            offerToReceiveVideo: true,

        });

        await peerConnection.current.setLocalDescription(

            offer

        );

        console.log(

            "✅ Offer Created"

        );

        return offer;

    }

    /* ==========================================
       CREATE ANSWER
    ========================================== */

    async function createAnswer(

        offer

    ) {

        if (

            !peerConnection.current ||

            !offer

        ) {

            return null;

        }

        if (

            peerConnection.current.remoteDescription

        ) {

            return null;

        }

        await peerConnection.current.setRemoteDescription(

            new RTCSessionDescription(

                offer

            )

        );

        const answer =

            await peerConnection.current.createAnswer();

        await peerConnection.current.setLocalDescription(

            answer

        );

        console.log(

            "✅ Answer Created"

        );

        while (

            pendingCandidates.current.length

        ) {

            const candidate =

                pendingCandidates.current.shift();

            try {

                await peerConnection.current.addIceCandidate(

                    new RTCIceCandidate(

                        candidate

                    )

                );

            }

            catch (err) {

                console.error(

                    "ICE Queue Error",

                    err

                );

            }

        }

        return answer;

    }
        /* ==========================================
       SET REMOTE ANSWER
    ========================================== */

    async function setRemoteAnswer(

        answer

    ) {

        if (

            !peerConnection.current ||

            !answer

        ) {

            return;

        }

        if (

            peerConnection.current.remoteDescription

        ) {

            return;

        }

        if (

            peerConnection.current.signalingState !==

            "have-local-offer"

        ) {

            console.log(

                "Waiting for local offer..."

            );

            return;

        }

        await peerConnection.current.setRemoteDescription(

            new RTCSessionDescription(

                answer

            )

        );

        console.log(

            "✅ Remote Answer Applied"

        );

        while (

            pendingCandidates.current.length

        ) {

            const candidate =

                pendingCandidates.current.shift();

            try {

                await peerConnection.current.addIceCandidate(

                    new RTCIceCandidate(

                        candidate

                    )

                );

            }

            catch (err) {

                console.error(

                    "Queued ICE Error",

                    err

                );

            }

        }

    }

    /* ==========================================
       SET REMOTE OFFER
    ========================================== */

    async function setRemoteOffer(

        offer

    ) {

        if (

            !peerConnection.current ||

            !offer

        ) {

            return;

        }

        if (

            peerConnection.current.remoteDescription

        ) {

            return;

        }

        await peerConnection.current.setRemoteDescription(

            new RTCSessionDescription(

                offer

            )

        );

        console.log(

            "✅ Remote Offer Applied"

        );

    }

    /* ==========================================
       ADD ICE CANDIDATE
    ========================================== */

    async function addIceCandidate(

        candidate

    ) {

        if (

            !peerConnection.current ||

            !candidate

        ) {

            return;

        }

        if (

            !peerConnection.current.remoteDescription

        ) {

            pendingCandidates.current.push(

                candidate

            );

            return;

        }

        try {

            await peerConnection.current.addIceCandidate(

                new RTCIceCandidate(

                    candidate

                )

            );

        }

        catch (err) {

            console.error(

                "ICE Candidate Error",

                err

            );

        }

    }
        /* ==========================================
       CLOSE CONNECTION
    ========================================== */

    function closeConnection() {

        pendingCandidates.current = [];

        if (!peerConnection.current) {

            return;

        }

        peerConnection.current.ontrack = null;

        peerConnection.current.onicecandidate = null;

        peerConnection.current.onconnectionstatechange = null;

        peerConnection.current.oniceconnectionstatechange = null;

        peerConnection.current.onsignalingstatechange = null;

        peerConnection.current.getSenders().forEach(sender => {

            if (sender.track) {

                sender.track.stop();

            }

        });

        peerConnection.current.close();

        peerConnection.current = null;

    }

    return {

        peerConnection,

        createPeerConnection,

        createOffer,

        createAnswer,

        setRemoteOffer,

        setRemoteAnswer,

        addIceCandidate,

        closeConnection,

    };

}

export default usePeerConnection;