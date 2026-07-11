import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

import {
    listenGameRoom,
    rollDice,
    releaseToken,
    moveToken,
} from "../../../services/gameService";

import LudoGrid from "../components/LudoGrid";

import "./LudoBoard.css";

function LudoBoard() {

    const { roomId } = useParams();

    const { user } = useAuth();

    const [room, setRoom] = useState(null);

    /* ===========================
       LISTEN GAME ROOM
    =========================== */

    useEffect(() => {

        if (!roomId) return;

        const unsubscribe = listenGameRoom(
            roomId,
            setRoom
        );

        return () => unsubscribe();

    }, [roomId]);


async function handleTokenClick(

    color,

    tokenId,

    token

) {

    try {

        if (

            token.pos === -1

        ) {

            await releaseToken(

                room.roomId,

                color,

                tokenId

            );

        }

        else {

            await moveToken(

                room.roomId,

                color,

                tokenId

            );

        }

    }

    catch (error) {

        console.log(error);

    }

}
    /* ===========================
       ROLL DICE
    =========================== */

    async function handleRollDice() {

        try {

            await rollDice(room.roomId);

        }

        catch (error) {

            console.log(error);

        }

    }

    /* ===========================
       LOADING
    =========================== */

    if (!room) {

        return (

            <div className="ludo-board-loading">

                <h2>Loading Game...</h2>

            </div>

        );

    }

    const currentPlayer = room.players[
        room.currentPlayer ?? 0
    ];

    const isMyTurn =
        room.playerIds[
            room.currentPlayer
        ] === user.uid;

    /* ===========================
       UI
    =========================== */

    return (

        <div className="ludo-board-page">

            {/* ================= HEADER ================= */}

            <div className="game-header">

                <div>

                    <h1>🎲 Ludo Match</h1>

                    <p className="room-id">

                        Room : {room.roomId}

                    </p>

                </div>

                <div className="status-box">

                    <span>

                        Status

                    </span>

                    <h3>

                        {room.status}

                    </h3>

                </div>

            </div>

            {/* ================= TURN CARD ================= */}

            <div className="turn-card">

                <div>

                    <small>Current Turn</small>

                    <h2>

                        {currentPlayer?.name}

                    </h2>

                </div>

                {

                    isMyTurn &&

                    <span className="your-turn">

                        YOUR TURN

                    </span>

                }

            </div>

            {/* ================= MAIN ================= */}

            <div className="ludo-layout">

                {/* ================= BOARD ================= */}

                <div className="board-wrapper">

             <LudoGrid

    board={room.board}

    room={room}

    currentUid={user.uid}

    onTokenClick={handleTokenClick}

/>

                </div>

                {/* ================= SIDEBAR ================= */}

                <aside className="game-sidebar">

                    {/* Players */}

                    <div className="sidebar-card">

                        <h2>

                            👥 Players

                        </h2>

                        <div className="players-list">

                            {

                                room.players.map(player => (

                                    <div

                                        key={player.uid}

                                        className={

                                            player.uid === currentPlayer.uid

                                                ? "player-item active-player"

                                                : "player-item"

                                        }

                                    >

                                        <div className="player-avatar">

                                            👤

                                        </div>

                                        <div className="player-details">

                                            <h4>

                                                {player.name}

                                            </h4>

                                            <span>

                                                {

                                                    player.uid === currentPlayer.uid

                                                        ? "Playing"

                                                        : "Waiting"

                                                }

                                            </span>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    </div>

                    {/* Dice */}

                    <div className="sidebar-card">

                        <h2>

                            🎲 Dice

                        </h2>

                        <div className="dice-box">

                            {

                                room.diceValue ??

                                "-"

                            }

                        </div>

                        <p className="dice-text">

                            {

                                room.diceValue

                                    ? `Last Roll : ${room.diceValue}`

                                    : "Roll the dice"

                            }

                        </p>

                    </div>

                    {/* Button */}

                    <button

                        className="roll-btn"

                        disabled={!isMyTurn}

                        onClick={handleRollDice}

                    >

                        {

                            isMyTurn

                                ? "🎲 Roll Dice"

                                : "Waiting for Turn"

                        }

                    </button>

                </aside>

            </div>

        </div>

    );

}

export default LudoBoard;