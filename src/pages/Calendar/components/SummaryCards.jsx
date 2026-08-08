import "./SummaryCards.css";

export default function SummaryCards({

    streakData,

}) {

    const currentStreak =
        streakData?.currentStreak ?? 0;

    const longestStreak =
        streakData?.longestStreak ?? 0;

    return (

        <div className="calendar-summary">

            {/* =========================
                CURRENT STREAK
            ========================== */}

            <div className="calendar-summary__card calendar-summary__card--current">

                <div className="calendar-summary__icon">

                    🔥

                </div>

                <div className="calendar-summary__content">

                    <p className="calendar-summary__label">

                        Current Streak

                    </p>

                    <h1 className="calendar-summary__value">

                        {currentStreak}

                    </h1>

                    <span className="calendar-summary__unit">

                        Days

                    </span>

                </div>

            </div>

            {/* =========================
                LONGEST STREAK
            ========================== */}

            <div className="calendar-summary__card calendar-summary__card--longest">

                <div className="calendar-summary__icon">

                    🏆

                </div>

                <div className="calendar-summary__content">

                    <p className="calendar-summary__label">

                        Longest Streak

                    </p>

                    <h1 className="calendar-summary__value">

                        {longestStreak}

                    </h1>

                    <span className="calendar-summary__unit">

                        Days

                    </span>

                </div>

            </div>

        </div>

    );

}