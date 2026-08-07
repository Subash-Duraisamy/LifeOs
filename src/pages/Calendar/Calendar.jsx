import "./Calendar.css";

import { useCalendar } from "./hooks/useCalendar";

import SummaryCards from "./components/SummaryCards";
import CalendarGrid from "./components/CalendarGrid";
import CalendarSidebar from "./components/CalendarSidebar";

export default function Calendar() {

  const {

    selectedDate,
    setSelectedDate,

    currentMonth,
    setCurrentMonth,

    records,
    setRecords,

    tasks,
    setTasks,

  } = useCalendar();

  return (

    <div className="calendar-page">

      <div className="calendar-page__container">

        {/* =========================
            SUMMARY
        ========================== */}

        <section className="calendar-page__summary-section">

          <SummaryCards
            calendarRecords={records}
          />

        </section>

        {/* =========================
            BODY
        ========================== */}

        <section className="calendar-page__body">

          {/* Calendar */}

          <div className="calendar-page__grid-wrapper">

            <CalendarGrid

              calendarCurrentMonth={currentMonth}
              setCalendarCurrentMonth={setCurrentMonth}

              calendarSelectedDate={selectedDate}
              setCalendarSelectedDate={setSelectedDate}

              calendarRecords={records}

            />

          </div>

          {/* Sidebar */}

          <div className="calendar-page__sidebar-wrapper">

            <CalendarSidebar

              selectedDate={selectedDate}

              tasks={tasks}
              setTasks={setTasks}

              records={records}
              setRecords={setRecords}

            />

          </div>

        </section>

      </div>

    </div>

  );

}