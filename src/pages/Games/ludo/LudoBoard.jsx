import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import LudoGrid from "./components/LudoGrid";


import {
    ArrowLeft,
    Dice6,
    Users,
    MessageCircle,
    Settings,
    LogOut,
    Crown,
} from "lucide-react";
import {

    listenRoom,

    leaveRoom,

    rollDice,

} from "../../../services/ludoService";

import "./LudoBoard.css";

function LudoBoard() {

    const { roomId } = useParams();

    const navigate = useNavigate();
    const { user } = useAuth();

    const [room, setRoom] = useState(null);

    useEffect(() => {

        const unsubscribe = listenRoom(

            roomId,

            setRoom

        );

        return unsubscribe;

    }, [roomId]);

    if (!room) {
        if (room.status === "finished") {

    const winner = room.players.find(

        player =>

            player.uid === room.winner

    );

    return (

        <div className="ludo-board-page">

            <h1>

                🏆 Winner

            </h1>

            <h2>

                {winner?.fullName}

            </h2>

            <button

                onClick={() =>

                    navigate("/games/ludo")

                }

            >

                Back to Lobby

            </button>

        </div>

    );

}

        return (

            <div className="ludo-board-page">

                Loading Game...

            </div>

        );

    }

    async function handleLeaveGame(){

    try{

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
async function handleRollDice() {

    console.log(room);

    try {

        await rollDice(

            room.id,

            user.uid

        );

    }

    catch (error) {

        console.log(error);

        alert(error.message);

    }

}

    function getColor(color){

    switch(color){

        case "red":
            return "🔴 Red";

        case "green":
            return "🟢 Green";

        case "yellow":
            return "🟡 Yellow";

        case "blue":
            return "🔵 Blue";

        default:
            return "⚪";

    }

}

    return (

        <div className="ludo-board-page">

            {/* ================= TOP BAR ================= */}

            <div className="board-topbar">

                <button
                    className="icon-btn"
                    onClick={() =>
                        navigate("/games/ludo")
                    }
                >

                    <ArrowLeft size={20}/>

                </button>

                <div>

                    <h2>

                        🎲 Ludo Match

                    </h2>

                    <span>

                        Room :

                        {" "}

                        {room.roomCode}

                    </span>

                </div>

            </div>

            {/* ================= MAIN ================= */}

            <div className="board-layout">

                {/* LEFT */}

                <div className="board-left">

                    <div className="side-card">

                        <h3>

                            Players

                        </h3>

                        {

                            room.players.map(player=>(

                                <div
                                    key={player.uid}
                                    className="player-item"
                                >

                                    <div>

                                        <strong>

                                            {player.fullName}

                                        </strong>

                                        {

                                            player.uid===room.hostUid &&

                                            <Crown
                                                size={14}
                                            />

                                        }

                                    </div>

                                    <span>

                                       <span>

    {

        getColor(player.color)

    }

</span>

                                    </span>

                                </div>

                            ))

                        }

                    </div>

                </div>

                {/* CENTER */}

                

<div className="board-center">

  <LudoGrid

    room={room}

    currentUser={user}

/>

</div>

{/* RIGHT */}

<div className="board-right">

                    <div className="side-card">

                        <h3>

                            Turn

                        </h3>

<h1>

    {

        room.currentTurn

            ?

            getColor(

                room.players.find(

                    player =>

                        player.uid === room.currentTurn

                )?.color

            )

            :

            "-"

    }

</h1>

                    </div>

                    <div className="side-card">

                        <Dice6 size={60}/>

<h2>

    {room.diceValue ?? 0}

</h2>

<button

    onClick={handleRollDice}

    disabled={

        room.currentTurn !== user.uid ||

        room.diceRolled

    }

>

    Roll Dice

</button>

                    </div>

                    <div className="side-card">

                        <h3>

                            Timer

                        </h3>

                        <h1>

                            30

                        </h1>

                    </div>

                </div>

            </div>

            {/* ================= BOTTOM ================= */}

            <div className="board-bottom">

                <button>

                    <MessageCircle size={18}/>

                    Chat

                </button>

                <button>

                    <Settings size={18}/>

                    Settings

                </button>

                <button

    onClick={handleLeaveGame}

>

    <LogOut size={18}/>

    Leave Game

</button>

            </div>

        </div>

    );

}

export default LudoBoard;