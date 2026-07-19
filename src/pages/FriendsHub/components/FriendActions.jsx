import {
    Phone,
    Video,
    Monitor,
    MessageCircle
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

import { createCall } from "../../../services/callService";

function FriendActions({ friend }) {

    const navigate = useNavigate();

    const { user } = useAuth();

    async function startVoiceCall() {

        try {

            const callId = await createCall({

                caller: user,

                receiver: friend,

                type: "voice",

            });

            navigate(`/calls/${callId}`);

        }

        catch (error) {

            console.error(error);

           alert(error.message);
        }

    }

    async function startVideoCall() {

        try {

            const callId = await createCall({

                caller: user,

                receiver: friend,

                type: "video",

            });

            navigate(`/calls/${callId}`);

        }

        catch (error) {

            console.error(error);

            alert("Unable to start video call.");

        }

    }

    async function shareScreen() {

        try {

            const callId = await createCall({

                caller: user,

                receiver: friend,

                type: "screen",

            });

            navigate(`/calls/${callId}`);

        }

        catch (error) {

            console.error(error);

            alert("Unable to start screen sharing.");

        }

    }

    function openChat() {

        console.log("Open Chat:", friend);

        // Future:
        // navigate(`/chat/${friend.friendUid}`);

    }

    return (

        <div
            style={{
                display: "flex",
                gap: "10px",
            }}
        >

            <button
                className="voice-btn"
                onClick={startVoiceCall}
                title="Voice Call"
            >
                <Phone size={18} />
            </button>

            <button
                className="video-btn"
                onClick={startVideoCall}
                title="Video Call"
            >
                <Video size={18} />
            </button>

            <button
                className="screen-btn"
                onClick={shareScreen}
                title="Share Screen"
            >
                <Monitor size={18} />
            </button>

            <button
                className="chat-btn"
                onClick={openChat}
                title="Message"
            >
                <MessageCircle size={18} />
            </button>

        </div>

    );

}

export default FriendActions;