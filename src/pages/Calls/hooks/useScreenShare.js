import { useCallback, useEffect, useRef, useState } from "react";

function useScreenShare() {

    const screenStreamRef = useRef(null);

    const [isSharing, setIsSharing] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    /* ==========================================
       STOP SCREEN SHARE
    ========================================== */

    const stopScreenShare = useCallback(() => {

        if (!screenStreamRef.current) return;

        screenStreamRef.current
            .getTracks()
            .forEach(track => track.stop());

        screenStreamRef.current = null;

        setIsSharing(false);

    }, []);

    /* ==========================================
       START SCREEN SHARE
    ========================================== */

    const startScreenShare = useCallback(async () => {

        try {

            setLoading(true);

            setError(null);

            const stream = await navigator.mediaDevices.getDisplayMedia({

                video: true,

                audio: true,

            });

            screenStreamRef.current = stream;

            setIsSharing(true);

            const videoTrack = stream.getVideoTracks()[0];

            videoTrack.onended = stopScreenShare;

            return stream;

        }

        catch (err) {

            console.error(err);

            setError(err);

            return null;

        }

        finally {

            setLoading(false);

        }

    }, [stopScreenShare]);

    /* ==========================================
       GET VIDEO TRACK
    ========================================== */

    const getScreenTrack = useCallback(() => {

        if (!screenStreamRef.current) return null;

        return screenStreamRef.current.getVideoTracks()[0];

    }, []);

    /* ==========================================
       REPLACE VIDEO TRACK
    ========================================== */

    const replaceVideoTrack = useCallback((peerConnection) => {

        if (!peerConnection || !screenStreamRef.current) return;

        const sender = peerConnection
            .getSenders()
            .find(sender => sender.track?.kind === "video");

        if (!sender) return;

        sender.replaceTrack(

            screenStreamRef.current.getVideoTracks()[0]

        );

    }, []);

    /* ==========================================
       CLEANUP
    ========================================== */

    useEffect(() => {

        return () => {

            stopScreenShare();

        };

    }, [stopScreenShare]);

    return {

        screenStreamRef,

        isSharing,

        loading,

        error,

        startScreenShare,

        stopScreenShare,

        getScreenTrack,

        replaceVideoTrack,

    };

}

export default useScreenShare;