import "./Calendar.css";

export default function Calendar() {
  return (
    <div className="calendar-page">

      {/* Header */}
      <div className="calendar-top">

        <div>
          <h1>Calendar</h1>
          <p>Track your daily streaks and productivity.</p>
        </div>

        <div className="streak-summary">
          <div className="summary-card">
            <h3>🔥 Current Streak</h3>
            <span>0 Days</span>
          </div>

          <div className="summary-card">
            <h3>🏆 Longest Streak</h3>
            <span>0 Days</span>
          </div>
        </div>

      </div>

      <div className="calendar-content">

        {/* Calendar */}
        <div className="calendar-section">

          <div className="calendar-header">

            <button>{"<"}</button>

            <h2>August 2026</h2>

            <button>{">"}</button>

          </div>

          <div className="calendar-grid">

            {/* Week Days */}

            <div className="day-name">Mon</div>
            <div className="day-name">Tue</div>
            <div className="day-name">Wed</div>
            <div className="day-name">Thu</div>
            <div className="day-name">Fri</div>
            <div className="day-name saturday">Sat</div>
            <div className="day-name sunday">Sun</div>

            {/* Temporary Calendar Cells */}

            {Array.from({ length: 35 }).map((_, index) => (
              <div
                key={index}
                className="calendar-cell"
              >
                <span>{index + 1}</span>
              </div>
            ))}

          </div>

        </div>

        {/* Right Side */}

        <div className="task-panel">

          <h2>Today's Tasks</h2>

          <button className="add-btn">
            + Add Task
          </button>

          <div className="task-list">

            <label>
              <input type="checkbox" />
              Gym
            </label>

            <label>
              <input type="checkbox" />
              Coding
            </label>

            <label>
              <input type="checkbox" />
              Reading
            </label>

          </div>

          <div className="break-free">

            <label>
              <input type="checkbox" />
              Break Free Today
            </label>

          </div>

          <button className="submit-btn">
            Submit
          </button>

        </div>

      </div>

    </div>
  );
}