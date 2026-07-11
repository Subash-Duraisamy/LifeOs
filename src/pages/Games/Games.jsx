import { useNavigate } from "react-router-dom";
import {
  Dice6,
  Crown,
  Swords,
  Puzzle,
  Users,
  Gamepad2,
  Bell,
} from "lucide-react";

import "./Games.css";

function Games() {

  const navigate = useNavigate();

  const games = [
    {
      title: "Ludo",
      description: "Play online with your friends.",
      icon: <Dice6 size={36} />,
      available: true,
      path: "/games/ludo",
    },
    {
      title: "Chess",
      description: "Coming Soon",
      icon: <Crown size={36} />,
      available: false,
    },
    {
      title: "Snake",
      description: "Coming Soon",
      icon: <Swords size={36} />,
      available: false,
    },
    {
      title: "Tic Tac Toe",
      description: "Coming Soon",
      icon: <Puzzle size={36} />,
      available: false,
    },
  ];

  return (

    <div className="games-page">

      <div className="games-banner">

        <Gamepad2 size={55} />

        <div>

          <h1>Games Hub</h1>

          <p>
            Play online with your friends anytime.
          </p>

        </div>

      </div>

      <div className="games-dashboard">

        <div className="left-panel">

          <section className="games-section">

            <h2>Continue Playing</h2>

            <div
              className="continue-card"
              onClick={() => navigate("/games/ludo")}
            >

              <Dice6 size={40} />

              <div>

                <h3>Ludo</h3>

                <p>Resume or start a new match.</p>

              </div>

            </div>

          </section>

          <section className="games-section">

            <h2>Available Games</h2>

            <div className="games-grid">

              {games.map((game, index) => (

                <div
                  key={index}
                  className={`game-card ${
                    !game.available
                      ? "disabled"
                      : ""
                  }`}
                  onClick={() =>
                    game.available &&
                    navigate(game.path)
                  }
                >

                  {game.icon}

                  <h3>{game.title}</h3>

                  <p>{game.description}</p>

                </div>

              ))}

            </div>

          </section>

        </div>

        <div className="right-panel">

          <section className="side-card">

            <h3>

              <Users size={20} />

              Friends Online

            </h3>

            <div className="friend">

              🟢 Rahul

            </div>

            <div className="friend">

              🟢 Arun

            </div>

            <div className="friend">

              ⚪ John

            </div>

          </section>

          <section className="side-card">

            <h3>

              <Bell size={20} />

              Invitations

            </h3>

            <p>No invitations.</p>

          </section>

        </div>

      </div>

    </div>

  );

}

export default Games;