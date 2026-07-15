import { useNavigate } from "react-router-dom";
import { Dice6, Crown, Gamepad2 } from "lucide-react";

import "./Games.css";

function Games() {

  const navigate = useNavigate();

  const games = [
    {
      title: "Ludo",
      description: "Play online with your friends.",
      icon: <Dice6 size={42} />,
      available: true,
      path: "/games/ludo",
    },
    {
      title: "Chess",
      description: "Coming Soon",
      icon: <Crown size={42} />,
      available: false,
    },
  ];

  return (

    <div className="games-page">

      <div className="games-header">

        <Gamepad2 size={58} />

        <div>

          <h1>Games Hub</h1>

          <p>
            Challenge your friends and enjoy multiplayer games.
          </p>

        </div>

      </div>

      <div className="games-grid">

        {games.map((game, index) => (

          <div
            key={index}
            className={`game-card ${
              !game.available ? "disabled" : ""
            }`}
            onClick={() =>
              game.available &&
              navigate(game.path)
            }
          >

            <div className="game-icon">
              {game.icon}
            </div>

            <h2>{game.title}</h2>

            <p>{game.description}</p>

            <button disabled={!game.available}>
              {game.available ? "Play Now" : "Coming Soon"}
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Games;