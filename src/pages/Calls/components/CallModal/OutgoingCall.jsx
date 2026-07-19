import "./IncomingCall.css";

function OutgoingCall({

    call,

    onCancel,

}) {

    if (!call) return null;

    return (

        <div className="incoming-overlay">

            <div className="incoming-card">

                {/* ======================================
                    RECEIVER IMAGE
                ======================================= */}

                <img

                    src={
                        call.receiverPhoto ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            call.receiverName || "User"
                        )}`
                    }

                    alt={call.receiverName}

                    className="incoming-avatar"

                />

                {/* ======================================
                    NAME
                ======================================= */}

                <h2>

                    {call.receiverName}

                </h2>

                {/* ======================================
                    CALL TYPE
                ======================================= */}

                <p>

                    Calling...

                </p>

                <p>

                    {

                        call.type === "video"

                            ? "📹 Video Call"

                            : "📞 Voice Call"

                    }

                </p>

                {/* ======================================
                    RINGING ANIMATION
                ======================================= */}

                <div className="calling-animation">

                    <span className="ring ring1"></span>

                    <span className="ring ring2"></span>

                    <span className="ring ring3"></span>

                </div>

                {/* ======================================
                    STATUS
                ======================================= */}

                <div className="call-status">

                    {

                        call.status === "ringing"

                            ? "Ringing..."

                            : call.status === "accepted"

                            ? "Connected"

                            : call.status === "rejected"

                            ? "Call Rejected"

                            : call.status === "ended"

                            ? "Call Ended"

                            : "Connecting..."

                    }

                </div>

                {/* ======================================
                    CANCEL BUTTON
                ======================================= */}

                <div className="incoming-buttons">

                    <button

                        className="reject-btn"

                        onClick={onCancel}

                    >

                        Cancel Call

                    </button>

                </div>

            </div>

        </div>

    );

}

export default OutgoingCall;