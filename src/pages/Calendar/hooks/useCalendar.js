import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { loadCalendarRecords } from "../../../services/calendarService";
import { loadUserStreak } from "../../../services/streak";

export function useCalendar() {

  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [records, setRecords] = useState({});

  const [tasks, setTasks] = useState([]);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
});

  useEffect(() => {

    if (!user) return;

    async function loadData() {

      const data = await loadCalendarRecords(user.uid);

      setRecords(data);
      const streak = await loadUserStreak(user.uid);

if (streak) {
    setStreakData(streak);
}

    }

    loadData();

  }, [user]);

return {
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
};

}