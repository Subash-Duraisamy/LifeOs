import "./CalendarGrid.css";

export default function CalendarGrid({

  calendarCurrentMonth,
  setCalendarCurrentMonth,

  calendarSelectedDate,
  setCalendarSelectedDate,

  calendarRecords,

}) {

  const weekDays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  const year = calendarCurrentMonth.getFullYear();

  const month = calendarCurrentMonth.getMonth();

  let firstDay = new Date(year, month, 1).getDay();

  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const emptyDays = Array(firstDay).fill(null);

  const monthDays = Array.from(
    { length: daysInMonth },
    (_, i) => i + 1
  );

  const today = new Date();

  function isToday(day) {

    return (

      today.getDate() === day &&

      today.getMonth() === month &&

      today.getFullYear() === year

    );

  }

  function isSelected(day) {

    return (

      calendarSelectedDate.getDate() === day &&

      calendarSelectedDate.getMonth() === month &&

      calendarSelectedDate.getFullYear() === year

    );

  }

  function goPreviousMonth() {

    setCalendarCurrentMonth(

      new Date(

        year,

        month - 1,

        1

      )

    );

  }

  function goNextMonth() {

    setCalendarCurrentMonth(

      new Date(

        year,

        month + 1,

        1

      )

    );

  }

  /* ===========================
   GET DAY RECORD
=========================== */

function getDayRecord(day) {

  const key =
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return calendarRecords[key];

}

/* ===========================
   GET HEATMAP CLASS
=========================== */

function getHeatmapClass(day) {

  const record = getDayRecord(day);

  if (!record) {

    return "";

  }

  if (record.breakFree) {

    return "calendar-grid__day--breakfree";

  }

  const percent =

    record.completionPercentage ??

    record.percentage ??

    0;

  if (percent === 0)

    return "calendar-grid__day--heat0";

  if (percent <= 25)

    return "calendar-grid__day--heat1";

  if (percent <= 50)

    return "calendar-grid__day--heat2";

  if (percent <= 75)

    return "calendar-grid__day--heat3";

  return "calendar-grid__day--heat4";

}
  return (

    <div className="calendar-grid">

      {/* ===========================
          Header
      =========================== */}

      <div className="calendar-grid__header">

        <button
          className="calendar-grid__header-btn"
          onClick={goPreviousMonth}
        >
          ❮
        </button>

        <h2 className="calendar-grid__header-title">

          {calendarCurrentMonth.toLocaleString("default", {

            month: "long",

            year: "numeric",

          })}

        </h2>

        <button
          className="calendar-grid__header-btn"
          onClick={goNextMonth}
        >
          ❯
        </button>

      </div>

      {/* ===========================
          Week Days
      =========================== */}

      <div className="calendar-grid__weekdays">

        {weekDays.map((day) => (

          <div

            key={day}

            className={

              day === "Sat"

                ? "calendar-grid__weekday calendar-grid__weekday--saturday"

                : day === "Sun"

                ? "calendar-grid__weekday calendar-grid__weekday--sunday"

                : "calendar-grid__weekday"

            }

          >

            {day}

          </div>

        ))}

      </div>

      {/* ===========================
          Calendar Days
      =========================== */}

      <div className="calendar-grid__days">

        {emptyDays.map((_, index) => (

          <div

            key={`empty-${index}`}

            className="calendar-grid__day calendar-grid__day--empty"

          />

        ))}

        {monthDays.map((day) => {

  const record = getDayRecord(day);

  return (

    <button

      key={day}

      onClick={() =>

        setCalendarSelectedDate(

          new Date(

            year,

            month,

            day

          )

        )

      }

      className={`

        calendar-grid__day

        ${isSelected(day) ? "calendar-grid__day--selected" : ""}

        ${isToday(day) ? "calendar-grid__day--today" : ""}

        ${getHeatmapClass(day)}

      `}

    >

      <span className="calendar-grid__day-number">

        {day}

      </span>

      {record?.submitted && (

        <span className="calendar-grid__day-icon">

          

        </span>

      )}

      {record?.breakFree && (

        <span className="calendar-grid__day-icon">

          🌴

        </span>

      )}

    </button>

  );

})}

      </div>

      {/* ===========================
          Legend
      =========================== */}

      <div className="calendar-grid__legend">

        <span className="calendar-grid__legend-label">

          Less

        </span>

        <div className="calendar-grid__legend-colors">

          <span className="calendar-grid__legend-box calendar-grid__legend-box--0"></span>

          <span className="calendar-grid__legend-box calendar-grid__legend-box--1"></span>

          <span className="calendar-grid__legend-box calendar-grid__legend-box--2"></span>

          <span className="calendar-grid__legend-box calendar-grid__legend-box--3"></span>

          <span className="calendar-grid__legend-box calendar-grid__legend-box--4"></span>

        </div>

        <span className="calendar-grid__legend-label">

          More

        </span>

      </div>

    </div>

  );

}