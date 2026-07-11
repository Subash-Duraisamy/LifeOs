import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  listenGameRoom,
  readyPlayer,
  cancelGame,
  startGame,
} from "../../../services/gameService";

import "./LudoRoom.css";

function LudoRoom() {

  const { roomId } = useParams();

  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const navigate = useNavigate();


  /* ===========================
     Listen Room
  =========================== */

  useEffect(() => {

    if (!roomId) return;

    const unsubscribe = listenGameRoom(

      roomId,

      setRoom

    );

    return () => unsubscribe();

  }, [roomId]);

  useEffect(() => {

    if (!room) return;

    if (room.status === "cancelled") {

        alert("Game was cancelled.");

        navigate("/games/ludo");

    }

}, [room, navigate]);

useEffect(() => {

    if (!room) return;

    if (room.status === "playing") {

        navigate(`/games/ludo/play/${room.roomId}`);

    }

}, [room, navigate]);

async function handleCancel() {

    if (

        !window.confirm(

            "Cancel this game?"

        )

    ) return;

    await cancelGame(roomId);

}
async function handleStartGame() {

    await startGame(roomId);

}
  

  /* ===========================
     Ready Button
  =========================== */

  async function handleReady() {

    try {

      await readyPlayer(

        roomId,

        user.uid

      );

    }

    catch (error) {

      console.log(error);

      alert(error.message);

    }

  }

  if (!room) {

    return (

      <div className="room-page">

        <h2>

          Loading Room...

        </h2>

      </div>

    );

  }
  const everyoneReady =
    room?.readyPlayers?.length === room?.players?.length;

  return (

    <div className="room-page">

      <div className="room-card">

        <h1>

          🎲 Ludo Lobby

        </h1>

        <h2>

          Room Code

        </h2>

        <p>

          {room.roomId}

        </p>

        <div className="players">

          {

 room.players.map((player) => (

    <div
        key={player.uid}
        className="player"
    >

        <span>

            👤 {player.name}

        </span>

        <span>

            {

                room.readyPlayers?.includes(player.uid)

                    ? "✅ Ready"

                    : "⏳ Waiting"

            }

        </span>

    </div>

))

          }

        </div>

<div className="room-buttons">

    <button

        onClick={handleReady}

    >

        I'm Ready

    </button>

    <button

        className="cancel-btn"

        onClick={handleCancel}

    >

        Cancel Game

    </button>

    {

        everyoneReady &&

        room.hostUid === user.uid && (

            <button

                className="start-btn"

                onClick={handleStartGame}

            >

                Start Game

            </button>

        )

    }

</div>

      </div>

    </div>

  );

}

export default LudoRoom;