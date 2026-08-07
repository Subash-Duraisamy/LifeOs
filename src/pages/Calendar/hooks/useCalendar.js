import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { loadCalendarRecords } from "../../../services/calendarService";

export function useCalendar() {

  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [records, setRecords] = useState({});

  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    if (!user) return;

    async function loadData() {

      const data = await loadCalendarRecords(user.uid);

      setRecords(data);

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

  };

}