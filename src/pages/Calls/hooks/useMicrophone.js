import { useCallback, useEffect, useRef, useState } from "react";

function useMicrophone() {

    const streamRef = useRef(null);

    const [micEnabled, setMicEnabled] = useState(true);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    /* ==========================================
       START MICROPHONE
    ========================================== */

    const startMicrophone = useCallback(async () => {

        try {

            setLoading(true);

            setError(null);

            const stream = await navigator.mediaDevices.getUserMedia({

                audio: {

                    echoCancellation: true,

                    noiseSuppression: true,

                    autoGainControl: true,

                },

                video: false,

            });

            streamRef.current = stream;

            setMicEnabled(true);

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
       STOP MICROPHONE
    ========================================== */

    const stopMicrophone = useCallback(() => {

        if (!streamRef.current) return;

        streamRef.current

            .getTracks()

            .forEach(track => {

                track.stop();

            });

        streamRef.current = null;

        setMicEnabled(false);

    }, []);

    /* ==========================================
       TOGGLE MICROPHONE
    ========================================== */

    const toggleMicrophone = useCallback(() => {

        if (!streamRef.current) return;

        const track = streamRef.current.getAudioTracks()[0];

        if (!track) return;

        track.enabled = !track.enabled;

        setMicEnabled(track.enabled);

    }, []);

    /* ==========================================
       MUTE
    ========================================== */

    const mute = useCallback(() => {

        if (!streamRef.current) return;

        streamRef.current

            .getAudioTracks()

            .forEach(track => {

                track.enabled = false;

            });

        setMicEnabled(false);

    }, []);

    /* ==========================================
       UNMUTE
    ========================================== */

    const unmute = useCallback(() => {

        if (!streamRef.current) return;

        streamRef.current

            .getAudioTracks()

            .forEach(track => {

                track.enabled = true;

            });

        setMicEnabled(true);

    }, []);

    /* ==========================================
       GET AUDIO TRACK
    ========================================== */

    const getAudioTrack = useCallback(() => {

        if (!streamRef.current) return null;

        return streamRef.current.getAudioTracks()[0];

    }, []);

    /* ==========================================
       CLEANUP
    ========================================== */

    useEffect(() => {

        return () => {

            if (streamRef.current) {

                streamRef.current

                    .getTracks()

                    .forEach(track => {

                        track.stop();

                    });

            }

        };

    }, []);

    return {

        streamRef,

        loading,

        error,

        micEnabled,

        startMicrophone,

        stopMicrophone,

        toggleMicrophone,

        mute,

        unmute,

        getAudioTrack,

    };

}

export default useMicrophone;