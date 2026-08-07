import { useMemo } from "react";
import "./SummaryCards.css";

export default function SummaryCards({
  calendarRecords = {},
}) {

  const { currentStreak, longestStreak } = useMemo(() => {

    const DAY = 24 * 60 * 60 * 1000;

    const records = Object.values(calendarRecords)
      .filter(r => r.submitted || r.breakFree)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (records.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
      };
    }

    /* ===========================
       LONGEST STREAK
    =========================== */

    let longest = 1;
    let streak = 1;

    for (let i = 1; i < records.length; i++) {

      const prev = new Date(records[i - 1].date);
      const curr = new Date(records[i].date);

      prev.setHours(0,0,0,0);
      curr.setHours(0,0,0,0);

      const diff = (curr - prev) / DAY;

      if (diff === 1) {
        streak++;
      } else if (diff === 0) {
        continue;
      } else {
        streak = 1;
      }

      longest = Math.max(longest, streak);
    }

    /* ===========================
       CURRENT STREAK
    =========================== */

    let current = 0;

    let pointer = new Date();
    pointer.setHours(0,0,0,0);

    // if today isn't submitted,
    // start from yesterday
    const todayKey =
      `${pointer.getFullYear()}-${String(pointer.getMonth()+1).padStart(2,"0")}-${String(pointer.getDate()).padStart(2,"0")}`;

    if (
      !calendarRecords[todayKey] ||
      (!calendarRecords[todayKey].submitted &&
       !calendarRecords[todayKey].breakFree)
    ) {
      pointer.setDate(pointer.getDate() - 1);
    }

    while (true) {

      const key =
        `${pointer.getFullYear()}-${String(pointer.getMonth()+1).padStart(2,"0")}-${String(pointer.getDate()).padStart(2,"0")}`;

      const record = calendarRecords[key];

      if (record && (record.submitted || record.breakFree)) {

        current++;

        pointer.setDate(pointer.getDate() - 1);

      } else {
        break;
      }
    }

    return {
      currentStreak: current,
      longestStreak: longest,
    };

  }, [calendarRecords]);

  return (

    <div className="calendar-summary">

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