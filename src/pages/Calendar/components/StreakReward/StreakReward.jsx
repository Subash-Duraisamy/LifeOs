import "./StreakReward.css";
import trophy from "./trophy.png";

export default function StreakReward({

    open,
    username,
    streak,
    onClose,

}) {

    if (!open) return null;

    return (

        <div
            className="streak-popup-overlay"
            onClick={onClose}
        >

            <div
                className="streak-popup"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Background Glow */}

                <div className="streak-popup-glow"></div>

                {/* Streak */}

                <div className="streak-popup-count">

                     {streak}

                </div>

                {/* Trophy */}

                <div className="streak-popup-trophy-wrapper">

                    <img
                        src={trophy}
                        alt="Trophy"
                        className="streak-popup-trophy"
                    />

                </div>

                {/* Congratulations */}

                <h1 className="streak-popup-title">

                Congratulations

                </h1>

                {/* Username */}

                <h2 className="streak-popup-name">

                    {username}

                </h2>

                <p className="streak-popup-text">

                    Continue your streak!

                </p>

                {/* Button */}

                <button

                    className="streak-popup-button"

                    onClick={onClose}

                >

                    Continue

                </button>

            </div>

        </div>

    );

}