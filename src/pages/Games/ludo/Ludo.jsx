import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

import "./Ludo.css";

import { useNavigate } from "react-router-dom";
import InviteFriendsModal from "../components/InviteFriendsModal";

import {
  listenGameInvites,
  acceptGameInvite,
  getMyActiveRoom,
  declineGameInvite,
  listenMySentInvites,
  listenMyActiveRoom,
} from "../../../services/gameService";


function Ludo() {

  const { user } = useAuth();

  const [showInvite, setShowInvite] = useState(false);

  const [roomCode, setRoomCode] = useState("");

  const [invites, setInvites] = useState([]);
   const navigate = useNavigate();
//    const navigate = useNavigate();
   
  /* =====================================
     LISTEN FOR GAME INVITES
  ===================================== */

  useEffect(() => {

    if (!user) return;

    const unsubscribe = listenGameInvites(
      user.uid,
      setInvites
    );

    return () => unsubscribe();

  }, [user]);
  /* =====================================
   LISTEN FOR ACCEPTED INVITES
===================================== */

useEffect(() => {

  if (!user) return;

  const unsubscribe = listenMySentInvites(

    user.uid,

    (invites) => {

      const acceptedInvite = invites.find(

        invite => invite.status === "accepted"

      );

      if (acceptedInvite) {

        navigate(`/games/ludo/${acceptedInvite.roomId}`);

      }

    }

  );

  return () => unsubscribe();

}, [user, navigate]);
useEffect(() => {

    if (!user) return;

    async function checkRoom() {

        const room = await getMyActiveRoom(user.uid);

        if (!room) return;

        if (room.status === "waiting") {

            navigate(`/games/ludo/${room.roomId}`);

        }

        if (room.status === "playing") {

            navigate(`/games/ludo/play/${room.roomId}`);

        }

    }

    checkRoom();

}, [user, navigate]);

/* =====================================
   LISTEN ACTIVE ROOM
===================================== */

useEffect(() => {

    if (!user) return;

    const unsubscribe = listenMyActiveRoom(

        user.uid,

        (room) => {

            if (!room) return;

            if (room.status === "waiting") {

                navigate(

                    `/games/ludo/${room.roomId}`

                );

            }

            if (room.status === "playing") {

                navigate(

                    `/games/ludo/play/${room.roomId}`

                );

            }

        }

    );

    return () => unsubscribe();

}, [user, navigate]);

  /* =====================================
     CREATE ROOM
  ===================================== */

  function handleCreateRoom() {

    alert("Create Room functionality coming next.");

  }

  /* =====================================
     JOIN ROOM
  ===================================== */

  function handleJoinRoom() {

    if (!roomCode.trim()) {

      alert("Please enter room code.");

      return;

    }

    alert(`Joining ${roomCode}`);

  }

  /* =====================================
     ACCEPT INVITE
  ===================================== */

  async function handleAccept(invite) {

    try {

  await acceptGameInvite(invite);

navigate(`/games/ludo/${invite.roomId}`);

    }

    catch (error) {

      alert(error.message);

    }

  }

  /* =====================================
     DECLINE INVITE
  ===================================== */

  async function handleDecline(invite) {

    try {

      await declineGameInvite(invite.id);

    }

    catch (error) {

      alert(error.message);

    }

  }
return (

<>
    <div className="ludo-page">

        {/* ================= HERO ================= */}

        <section className="ludo-hero">

            <div className="hero-left">

                <div className="hero-badge">

                    🎮 Multiplayer Game

                </div>

                <h1>

                    🎲 Ludo Online

                </h1>

                <p>

                    Challenge your LifeOS friends,
                    create private rooms,
                    receive live invitations and
                    enjoy multiplayer Ludo together.

                </p>

                <div className="hero-buttons">

                    <button
                        className="primary-btn"
                        onClick={handleCreateRoom}
                    >

                        🎲 Create Room

                    </button>

                    <button
                        className="secondary-btn"
                        onClick={() =>
                            setShowInvite(true)
                        }
                    >

                        👥 Invite Friends

                    </button>

                </div>

            </div>

            <div className="hero-right">

                <div className="hero-circle">

                    🎲

                </div>

            </div>

        </section>

        {/* ================= QUICK STATS ================= */}

        <section className="stats-grid">

            <div className="stat-card">

                <h3>

                    Active Game

                </h3>

                <span>

                    {invites.length > 0 ? "Yes" : "No"}

                </span>

            </div>

            <div className="stat-card">

                <h3>

                    Pending Invites

                </h3>

                <span>

                    {invites.length}

                </span>

            </div>

            <div className="stat-card">

                <h3>

                    Friends

                </h3>

                <span>

                    Online

                </span>

            </div>

        </section>

        {/* ================= MAIN GRID ================= */}

        <section className="ludo-dashboard">

            {/* ================= LEFT ================= */}

            <div className="dashboard-left">

                {/* ================= CREATE ================= */}

                <div className="ludo-card">

                    <div className="card-icon">

                        🎲

                    </div>

                    <h2>

                        Create Room

                    </h2>

                    <p>

                        Start a private multiplayer
                        room and invite your
                        friends instantly.

                    </p>

                    <button
                        className="action-btn"
                        onClick={handleCreateRoom}
                    >

                        Create Room

                    </button>

                </div>

                {/* ================= JOIN ================= */}

                <div className="ludo-card">

                    <div className="card-icon">

                        🚪

                    </div>

                    <h2>

                        Join Room

                    </h2>

                    <p>

                        Already have a room code?
                        Join your friend's match.

                    </p>

                    <input

                        value={roomCode}

                        onChange={(e)=>

                            setRoomCode(

                                e.target.value

                            )

                        }

                        placeholder="Enter Room Code"

                    />

                    <button

                        className="action-btn"

                        onClick={handleJoinRoom}

                    >

                        Join Room

                    </button>

                </div>

                {/* ================= INVITE ================= */}

                <div className="ludo-card">

                    <div className="card-icon">

                        👥

                    </div>

                    <h2>

                        Invite Friends

                    </h2>

                    <p>

                        Invite your LifeOS
                        friends and start
                        playing together.

                    </p>

                    <button

                        className="action-btn"

                        onClick={()=>

                            setShowInvite(true)

                        }

                    >

                        Invite Friends

                    </button>

                </div>
                                {/* ================= PENDING INVITATIONS ================= */}

                <div className="ludo-card invite-card">

                    <div className="card-icon">

                        📩

                    </div>

                    <h2>

                        Pending Invitations

                    </h2>

                    {

                        invites.length === 0 ? (

                            <div className="empty-state">

                                <span>

                                    🎉

                                </span>

                                <p>

                                    No pending invitations.

                                </p>

                            </div>

                        ) : (

                            invites.map(invite => (

                                <div

                                    key={invite.id}

                                    className="invite-item"

                                >

                                    <div>

                                        <h4>

                                            {invite.fromName}

                                        </h4>

                                        <p>

                                            invited you to play{" "}

                                            <strong>

                                                {invite.game}

                                            </strong>

                                        </p>

                                    </div>

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

                                            className="decline-btn"

                                            onClick={() =>

                                                handleDecline(invite)

                                            }

                                        >

                                            Decline

                                        </button>

                                    </div>

                                </div>

                            ))

                        )

                    }

                </div>

            </div>

            {/* ================= RIGHT PANEL ================= */}

            <div className="dashboard-right">

                <div className="side-card">

                    <h2>

                        🎯 Quick Tips

                    </h2>

                    <ul>

                        <li>

                            Invite friends to create a private room.

                        </li>

                        <li>

                            Share the room code to join instantly.

                        </li>

                        <li>

                            Both players must be ready before starting.

                        </li>

                        <li>

                            Roll a 6 to get another chance.

                        </li>

                    </ul>

                </div>

                <div className="side-card">

                    <h2>

                        🏆 Recent Matches

                    </h2>

                    <div className="history-item">

                        No matches played yet.

                    </div>

                </div>

            </div>

        </section>

    </div>

    <InviteFriendsModal

        open={showInvite}

        onClose={() =>

            setShowInvite(false)

        }

    />

</>

);

}

export default Ludo;