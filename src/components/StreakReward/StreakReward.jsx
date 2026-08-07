import "./StreakReward.css";
import medal from "../../assets/medal.png";

export default function StreakReward({
    streak,
    username,
    open,
    onClose
}) {

    if (!open) return null;

    return (

        <div className="reward-overlay">

            <div className="reward-card">

                <img
                    src={medal}
                    className="reward-medal"
                    alt=""
                />

                <div className="reward-streak">

                    🔥 {streak}

                </div>

                <h1>

                    Congratulations {username}!

                </h1>

                <p>

                    You're on a {streak} Day Streak

                </p>

            </div>

        </div>

    );

}