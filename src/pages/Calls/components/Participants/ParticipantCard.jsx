function ParticipantCard({

    participant,

    isSpeaking = false,

    isMuted = false,

    cameraEnabled = true,

    isHost = false,

    onClick,

}) {

    if (!participant) return null;

    return (

        <div

            className={`participant-card ${isSpeaking ? "speaking" : ""}`}

            onClick={onClick}

        >

            {/* ===========================
                VIDEO / AVATAR
            =========================== */}

            {

                cameraEnabled ? (

                    participant.stream ? (

                        <video

                            ref={(video) => {

                                if (

                                    video &&

                                    participant.stream

                                ) {

                                    video.srcObject =

                                        participant.stream;

                                }

                            }}

                            autoPlay

                            playsInline

                            muted={participant.isLocal}

                            className="participant-video"

                        />

                    ) : (

                        <div className="participant-placeholder">

                            Loading...

                        </div>

                    )

                ) : (

                    <div className="participant-avatar">

                        {

                            participant.name

                                ?.charAt(0)

                                ?.toUpperCase()

                        }

                    </div>

                )

            }

            {/* ===========================
                INFO
            =========================== */}

            <div className="participant-footer">

                <div className="participant-name">

                    {participant.name}

                </div>

                <div className="participant-icons">

                    {

                        isHost &&

                        <span title="Host">

                            👑

                        </span>

                    }

                    {

                        isMuted

                            ? (

                                <span title="Muted">

                                    🔇

                                </span>

                            )

                            : (

                                <span title="Microphone">

                                    🎤

                                </span>

                            )

                    }

                    {

                        !cameraEnabled &&

                        <span title="Camera Off">

                            📷

                        </span>

                    }

                </div>

            </div>

            {/* ===========================
                SPEAKING INDICATOR
            =========================== */}

            {

                isSpeaking &&

                <div className="speaking-ring" />

            }

        </div>

    );

}

export default ParticipantCard;