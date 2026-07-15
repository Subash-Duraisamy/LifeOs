import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

import { joinRoom } from "../../../services/ludoService";

import "./JoinRoom.css";

function JoinRoom() {

    const navigate = useNavigate();

    const { user } = useAuth();

    const [roomCode, setRoomCode] = useState("");

    const [loading, setLoading] = useState(false);

    async function handleJoin() {

        if (loading) return;

        console.log("========== JOIN ROOM ==========");
        console.log("User:");
        console.log(user);
        console.log("Room Code:", roomCode);

        if (!user) {

            alert("User not loaded.");

            return;

        }

        if (!roomCode.trim()) {

            alert("Please enter a room code.");

            return;

        }

        try {

            setLoading(true);

            const roomId = await joinRoom(

                roomCode.trim().toUpperCase(),

                user

            );

            console.log("Joined Room:", roomId);

            navigate(

                `/games/ludo/room/${roomId}`

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

        <div className="join-page">

            <div className="join-card">

                <h1>

                    Join Room

                </h1>

                <input

                    value={roomCode}

                    onChange={(e) =>
                        setRoomCode(
                            e.target.value
                        )
                    }

                    placeholder="Enter Room Code"

                    autoComplete="off"

                    maxLength={6}

                />

                <button

                    onClick={handleJoin}

                    disabled={loading}

                >

                    {

                        loading

                            ? "Joining..."

                            : "Join Room"

                    }

                </button>

            </div>

        </div>

    );

}

export default JoinRoom;