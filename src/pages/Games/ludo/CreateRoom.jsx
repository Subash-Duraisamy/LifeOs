import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Users,
    ArrowLeft,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";

import { createRoom } from "../../../services/ludoService";

import "./CreateRoom.css";

function CreateRoom() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [players, setPlayers] = useState(2);

    const [loading, setLoading] = useState(false);

    async function handleCreateRoom() {

        if (loading) return;

        console.log("========== CREATE ROOM ==========");
        console.log("User:");
        console.log(user);
        console.log("Players:", players);

        if (!user) {

            alert("User not loaded.");

            return;

        }

        try {

            setLoading(true);

            console.log("Calling createRoom()...");

            const room = await createRoom(

                user,

                players

            );

            console.log("Room Created Successfully");
            console.log(room);

            navigate(

                `/games/ludo/room/${room.roomId}`

            );

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="create-room-page">

            <div className="room-card">

                <button

                    className="back-btn"

                    disabled={loading}

                    onClick={() => navigate("/games/ludo")}

                >

                    <ArrowLeft size={18} />

                    Back

                </button>

                <h1>

                    Create Ludo Room

                </h1>

                <p>

                    Choose how many players can join this room.

                </p>

                <div className="player-options">

                    {

                        [2, 3, 4].map(number => (

                            <button

                                key={number}

                                type="button"

                                disabled={loading}

                                className={`player-option ${

                                    players === number

                                        ? "selected"

                                        : ""

                                }`}

                                onClick={() => setPlayers(number)}

                            >

                                <Users size={34} />

                                <h3>

                                    {number}

                                </h3>

                                <span>

                                    Players

                                </span>

                            </button>

                        ))

                    }

                </div>

                <button

                    className="create-btn"

                    disabled={loading}

                    onClick={handleCreateRoom}

                >

                    {

                        loading

                            ? "Creating Room..."

                            : `Create ${players} Player Room`

                    }

                </button>

            </div>

        </div>

    );

}

export default CreateRoom;