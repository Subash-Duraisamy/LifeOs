import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    PlusCircle,
    DoorOpen,
    Clock3,
    PlayCircle,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";

import { getMyActiveRoom } from "../../../services/ludoService";

import "./LudoHome.css";

function LudoHome() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const [activeRoom, setActiveRoom] = useState(null);

    useEffect(() => {

        if (!user) {

            setLoading(false);

            return;

        }

        loadRoom();

    }, [user]);

    async function loadRoom() {

        try {

            const room = await getMyActiveRoom(user.uid);

            setActiveRoom(room);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <div className="ludo-home">

                <div className="ludo-banner">

                    <h1>🎲 Ludo</h1>

                    <p>Loading...</p>

                </div>

            </div>

        );

    }

    return (

        <div className="ludo-home">

            <div className="ludo-banner">

                <h1>🎲 Ludo</h1>

                <p>

                    Play multiplayer games with your friends.

                </p>

            </div>

            <div className="ludo-grid">

                {

                    activeRoom ? (

                        <div

                            className="ludo-card"

                            onClick={() =>

                                navigate(

                                    `/games/ludo/room/${activeRoom.id}`

                                )

                            }

                        >

                            <PlayCircle size={48} />

                            <h2>

                                Continue Game

                            </h2>

                            <p>

                                Rejoin your current Ludo room.

                            </p>

                        </div>

                    )

                    :

                    <>

                        <div

                            className="ludo-card"

                            onClick={() =>

                                navigate("/games/ludo/create")

                            }

                        >

                            <PlusCircle size={48} />

                            <h2>

                                Create Room

                            </h2>

                            <p>

                                Create a room and invite friends.

                            </p>

                        </div>

                        <div

                            className="ludo-card"

                            onClick={() =>

                                navigate("/games/ludo/join")

                            }

                        >

                            <DoorOpen size={48} />

                            <h2>

                                Join Room

                            </h2>

                            <p>

                                Join using a room code.

                            </p>

                        </div>

                        <div className="ludo-card disabled">

                            <Clock3 size={48} />

                            <h2>

                                Recent Matches

                            </h2>

                            <p>

                                Coming Soon

                            </p>

                        </div>

                    </>

                }

            </div>

        </div>

    );

}

export default LudoHome;