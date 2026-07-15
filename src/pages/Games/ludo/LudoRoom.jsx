import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Users,
    Copy,
    CheckCircle,
    XCircle,
    Crown,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

import {
    listenRoom,
    leaveRoom,
    toggleReady,
    startGame,
} from "../../../services/ludoService";


import InviteFriends from "./components/InviteFriends";

import "./LudoRoom.css";

function LudoRoom() {

    const { roomId } = useParams();

    const navigate = useNavigate();

    const [room, setRoom] = useState(undefined);
    const { user } = useAuth();

    const [copied, setCopied] = useState(false);

    useEffect(() => {

        const unsubscribe = listenRoom(

            roomId,

            (data) => {

                if(data===null){

    alert("Game ended.");

    navigate("/games/ludo");

    return;

}

setRoom(data);

if (

    data &&

    data.status === "playing"

) {

    navigate(

        `/games/ludo/game/${roomId}`

    );

}

            }

        );

        return unsubscribe;

    }, [roomId]);

    async function handleLeaveRoom() {

    try {

        await leaveRoom(

            room.id,

            user

        );

        navigate("/games/ludo");

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}

async function handleStartGame() {

    try {

        await startGame(

            room.id

        );

    }

    catch(error){

        console.log(error);

        alert(error.message);

    }

}
async function handleReady() {

    try {

        await toggleReady(

            room.id,

            user.uid

        );

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}
    async function copyRoomCode() {

        if (!room) return;

        await navigator.clipboard.writeText(
            room.roomCode
        );

        setCopied(true);

        setTimeout(() => {

            setCopied(false);

        }, 1500);

    }

useEffect(() => {

    if (room === null) {

        alert("Room no longer exists.");

        navigate("/games/ludo");

    }

}, [room, navigate]);

if (room === undefined) {

    return (

        <div className="ludo-room">

            <h2>

                Loading Room...

            </h2>

        </div>

    );

}

    return (

        <div className="ludo-room">

            {/* ================= HEADER ================= */}

            <div className="room-header">

                <h1>

                    🎲 Ludo Room

                </h1>

                <p>

                    Waiting for players to join...

                </p>

            </div>

            {/* ================= ROOM CODE ================= */}

            <div className="room-code-card">

                <h3>

                    Room Code

                </h3>

                <div className="room-code">

                    <span>

                        {room.roomCode}

                    </span>

                    <button
                        onClick={copyRoomCode}
                    >

                        <Copy size={18} />

                    </button>

                </div>

                {

                    copied &&

                    <small>

                        Copied!

                    </small>

                }

            </div>

            {/* ================= PLAYERS ================= */}

            <div className="players-card">

                <h2>

                    <Users size={22} />

                    Players

                    {" "}

                    (

                    {room.players.length}

                    /

                    {room.maxPlayers}

                    )

                </h2>

                {

                    room.players.map(player => (

                        <div

                            className="player-row"

                            key={`${player.uid}-${player.color}`}

                        >

                            <div>

                                <strong>

                                    {player.fullName}

                                </strong>

                                {

                                    player.uid === room.hostUid &&

                                    <span className="host-badge">

                                        <Crown
                                            size={14}
                                        />

                                        Host

                                    </span>

                                }

                                <br />

                                @{player.username}

                            </div>

                            {

                                player.ready ?

                                    <div className="ready">

                                        <CheckCircle size={18} />

                                        Ready

                                    </div>

                                    :

                                    <div className="not-ready">

                                        <XCircle size={18} />

                                        Waiting

                                    </div>

                            }

                        </div>

                    ))

                }

                {

                    Array.from({

                        length:

                            room.maxPlayers -

                            room.players.length,

                    }).map((_, index) => (

                        <div

                            key={index}

                            className="player-row empty-slot"

                        >

                            Empty Slot

                        </div>

                    ))

                }

            </div>

            {/* ================= INVITE ================= */}

  {
    user.uid === room.hostUid &&
    room.players.length < room.maxPlayers && (

        <InviteFriends
            room={room}
        />

    )
}

            {/* ================= BUTTONS ================= */}

          <div className="room-buttons">

    <button

        className="cancel-btn"

        onClick={handleLeaveRoom}

    >

        Leave Room

    </button>

    {

        room.players.find(

            player =>

                player.uid === user.uid

        )?.ready ?

        (

            <button

                className="ready-btn"

                onClick={handleReady}

            >

                Unready

            </button>

        )

        :

        (

            <button

                className="ready-btn"

                onClick={handleReady}

            >

                Ready

            </button>

        )

    }

    {

        user.uid === room.hostUid &&

        (

<button

    className="start-btn"

    onClick={handleStartGame}

    disabled={

        room.players.length < 2 ||

        room.players.some(

            player =>

                !player.ready

        )

    }

>

    Start Game

</button>

        )

    }

</div>

        </div>

    );

}

export default LudoRoom;