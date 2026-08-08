import { useState } from "react";
import "./Calendar.css";
import { useCalendar } from "./hooks/useCalendar";
import StreakReward from "./components/StreakReward/StreakReward";
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

  streakData,
  setStreakData,

} = useCalendar();
  const [showReward, setShowReward] = useState(false);

const [rewardData, setRewardData] = useState({
    username: "",
    streak: 0,
});

  return (

    <div className="calendar-page">

      <div className="calendar-page__container">

        {/* =========================
            SUMMARY
        ========================== */}

        <section className="calendar-page__summary-section">

     <SummaryCards
    streakData={streakData}
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

setStreakData={setStreakData}

setShowReward={setShowReward}
setRewardData={setRewardData}

/>

          </div>

        </section>

      </div>
      <StreakReward

    open={showReward}

    username={rewardData.username}

    streak={rewardData.streak}

    onClose={() => setShowReward(false)}

/>

    </div>

  );

}