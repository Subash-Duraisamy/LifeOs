import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../../hooks/useAuth";

import {
    listenLudoInvites,
    acceptLudoInvite,
    rejectLudoInvite,
} from "../../../../services/ludoService";

import "./InviteNotification.css";

function InviteNotification() {

    const { user } = useAuth();

    const navigate = useNavigate();

    const [invites, setInvites] = useState([]);

    useEffect(() => {

        if (!user) return;

        const unsubscribe = listenLudoInvites(

            user.uid,

            setInvites

        );

        return unsubscribe;

    }, [user]);

    async function handleAccept(invite) {

        try {

            const roomId =
                await acceptLudoInvite(invite);

            navigate(
                `/games/ludo/room/${roomId}`
            );

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

    }

    async function handleReject(invite) {

        try {

            await rejectLudoInvite(invite.id);

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

    }

    if (invites.length === 0) {

        return null;

    }

    return (

        <div className="invite-popup-container">

            {

                invites.map(invite => (

                    <div

                        key={invite.id}

                        className="invite-popup"

                    >

                        <h3>

                            🎲 Ludo Invitation

                        </h3>

                        <p>

                            <strong>

                                {invite.fromName}

                            </strong>

                            {" "}invited you.

                        </p>

                        <div className="invite-actions">

                            <button

                                className="accept-btn"

                                onClick={() =>
                                    handleAccept(invite)
                                }

                            >

                                Accept

                            </button>

                            <button

                                className="reject-btn"

                                onClick={() =>
                                    handleReject(invite)
                                }

                            >

                                Reject

                            </button>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default InviteNotification;