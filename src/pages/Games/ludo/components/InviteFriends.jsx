import { useEffect, useState } from "react";

import { UserPlus } from "lucide-react";

import { useAuth } from "../../../../hooks/useAuth";

import { getFriends } from "../../../../services/friendService";

import {
    sendLudoInvite,
} from "../../../../services/ludoService";

import "./InviteFriends.css";

function InviteFriends({ room }) {

    const { user } = useAuth();

    const [friends, setFriends] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!user) return;

        loadFriends();

    }, [user]);

    async function loadFriends() {

        try {

            console.log("========== LOADING FRIENDS ==========");
            console.log(user);

            const data = await getFriends(user);

            console.log("Friends Found");
            console.log(data);

            setFriends(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    async function handleInvite(friend) {

        try {

            await sendLudoInvite(

                room.id,

                user,

                friend

            );

            alert("Invitation Sent");

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

    }

    return (

        <div className="invite-card">

            <h2>

                Invite Friends

            </h2>

            {

                loading ?

                    (

                        <div className="empty">

                            Loading Friends...

                        </div>

                    )

                    :

                    friends.length === 0 ?

                        (

                            <div className="empty">

                                No Friends

                            </div>

                        )

                        :

                        friends.map(friend => (

                            <div

                                key={friend.uid}

                                className="invite-row"

                            >

                                <div>

                                    <strong>

                                        {friend.fullName}

                                    </strong>

                                    <br />

                                    @{friend.username}

                                </div>

                                <button

                                    onClick={() =>
                                        handleInvite(friend)
                                    }

                                >

                                    <UserPlus size={18} />

                                    Invite

                                </button>

                            </div>

                        ))

            }

        </div>

    );

}

export default InviteFriends;