import "./IncomingCall.css";

function IncomingCall({

    call,

    onAccept,

    onReject,

}) {

    if (!call) return null;

    return (

        <div className="incoming-overlay">

            <div className="incoming-card">

                <img

                    src={
                        call.callerPhoto ||
                        `https://ui-avatars.com/api/?name=${call.callerName}`
                    }

                    alt={call.callerName}

                    className="incoming-avatar"

                />

                <h2>

                    {call.callerName}

                </h2>

                <p>

                    Incoming {call.type} call...

                </p>

                <div className="incoming-buttons">

                    <button

                        className="accept-btn"

                        onClick={onAccept}

                    >

                        Accept

                    </button>

                    <button

                        className="reject-btn"

                        onClick={onReject}

                    >

                        Decline

                    </button>

                </div>

            </div>

        </div>

    );

}

export default IncomingCall;