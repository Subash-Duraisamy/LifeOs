import { useCallback, useEffect, useRef, useState } from "react";

function useCamera() {

    const streamRef = useRef(null);

    const [cameraEnabled, setCameraEnabled] = useState(true);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    /* ==========================================
       START CAMERA
    ========================================== */

    const startCamera = useCallback(async () => {

        try {

            setLoading(true);

            setError(null);

            const stream = await navigator.mediaDevices.getUserMedia({

                video: {
                    width: 1280,
                    height: 720,
                    facingMode: "user",
                },

                audio: false,

            });

            streamRef.current = stream;

            setCameraEnabled(true);

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

    }, []);

    /* ==========================================
       STOP CAMERA
    ========================================== */

    const stopCamera = useCallback(() => {

        if (!streamRef.current) return;

        streamRef.current.getTracks().forEach(track => {

            track.stop();

        });

        streamRef.current = null;

        setCameraEnabled(false);

    }, []);

    /* ==========================================
       TOGGLE CAMERA
    ========================================== */

    const toggleCamera = useCallback(() => {

        if (!streamRef.current) return;

        const track = streamRef.current.getVideoTracks()[0];

        if (!track) return;

        track.enabled = !track.enabled;

        setCameraEnabled(track.enabled);

    }, []);

    /* ==========================================
       SWITCH CAMERA (Mobile)
    ========================================== */

    const switchCamera = useCallback(async () => {

        if (!streamRef.current) return;

        const currentTrack = streamRef.current.getVideoTracks()[0];

        const facingMode =

            currentTrack.getSettings().facingMode === "environment"

                ? "user"

                : "environment";

        stopCamera();

        try {

            const stream = await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode,

                },

                audio: false,

            });

            streamRef.current = stream;

            setCameraEnabled(true);

            return stream;

        }

        catch (err) {

            console.error(err);

        }

    }, [stopCamera]);

    /* ==========================================
       CLEANUP
    ========================================== */

    useEffect(() => {

        return () => {

            if (streamRef.current) {

                streamRef.current

                    .getTracks()

                    .forEach(track => track.stop());

            }

        };

    }, []);

    return {

        streamRef,

        loading,

        error,

        cameraEnabled,

        startCamera,

        stopCamera,

        toggleCamera,

        switchCamera,

    };

}

export default useCamera;