import "./CallControls.css";

function CallControls({

    micEnabled,

    cameraEnabled,

    isSharing,

    onToggleMic,

    onToggleCamera,

    onShareScreen,

    onOpenChat,

    onEndCall,

}) {

    return (

        <div className="call-controls">

            {/* =======================
                MICROPHONE
            ======================= */}

            <button

                className={`control-btn ${micEnabled ? "" : "active"}`}

                onClick={onToggleMic}

                title="Microphone"

            >

                {

                    micEnabled

                        ? "🎤"

                        : "🔇"

                }

            </button>

            {/* =======================
                CAMERA
            ======================= */}

            <button

                className={`control-btn ${cameraEnabled ? "" : "active"}`}

                onClick={onToggleCamera}

                title="Camera"

            >

                {

                    cameraEnabled

                        ? "📹"

                        : "📷"

                }

            </button>

            {/* =======================
                SCREEN SHARE
            ======================= */}

            <button

                className={`control-btn ${isSharing ? "sharing" : ""}`}

                onClick={onShareScreen}

                title="Screen Share"

            >

                🖥️

            </button>

            {/* =======================
                CHAT
            ======================= */}

            <button

                className="control-btn"

                onClick={onOpenChat}

                title="Chat"

            >

                💬

            </button>

            {/* =======================
                END CALL
            ======================= */}

            <button

                className="control-btn end-call"

                onClick={onEndCall}

                title="End Call"

            >

                📞❌

            </button>

        </div>

    );

}

export default CallControls;