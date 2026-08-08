import { useEffect, useMemo, useState } from "react";

import "./CalendarSidebar.css";

import { useAuth } from "../../../hooks/useAuth";
import {
    doc,
    getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";

import { calculateAndSaveStreak } from "../../../services/streak";



import {

  loadDayRecord,

  saveDayRecord,

} from "../../../services/calendarService";


export default function CalendarSidebar({

  selectedDate,

  tasks,
  setTasks,

  records,
  setRecords,

  setStreakData,

  setShowReward,
  setRewardData,

}){

  /* =========================
      LOCAL STATES
  ========================= */

  const [taskInput, setTaskInput] = useState("");

  const [breakFree, setBreakFree] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

const dateKey = useMemo(() => {

  const year = selectedDate.getFullYear();

  const month = String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    selectedDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;

}, [selectedDate]);
useEffect(() => {

    async function loadDay() {

        if (!user) return;

        let record = records[dateKey];

        if (!record) {

            record = await loadDayRecord(
                user.uid,
                dateKey
            );

            if (record) {
                setRecords(prev => ({
                    ...prev,
                    [dateKey]: record
                }));
            }

        }

        if (!record) {
            setTasks([]);
            setBreakFree(false);
            setSubmitted(false);
            return;
        }

        setTasks(record.tasks || []);
        setBreakFree(record.breakFree || false);
        setSubmitted(record.submitted || false);

    }

    loadDay();

}, [user, dateKey]);

  /* =========================
      CALCULATIONS
  ========================= */

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(

    (task) => task.completed

  ).length;

  const completionPercentage =

    totalTasks === 0

      ? 0

      : Math.round(

          (completedTasks / totalTasks) * 100

        );

        /* =========================
   ADD TASK
========================= */

async function addTask() {

  const title = taskInput.trim();

  if (!title) {

    return;

  }

  const alreadyExists = tasks.some(

    (task) =>

      task.title.toLowerCase() ===

      title.toLowerCase()

  );

  if (alreadyExists) {

    alert("Task already exists.");

    return;

  }

  const updatedTasks = [

    ...tasks,

    {

      id: Date.now(),

      title,

      completed: false,

    },

  ];

  setTasks(updatedTasks);

  setTaskInput("");

  if (!user) return;

const updatedRecord = {
    date: dateKey,

    tasks: updatedTasks,

    breakFree,

    submitted,

    totalTasks: updatedTasks.length,

    completedTasks: updatedTasks.filter(

      (task) => task.completed

    ).length,

    completionPercentage:

      updatedTasks.length === 0

        ? 0

        : Math.round(

            (

              updatedTasks.filter(

                (task) => task.completed

              ).length /

              updatedTasks.length

            ) * 100

          ),

  };
  console.log("USER UID:", user?.uid);

console.log("DATE:", dateKey);

console.log("DATA:", updatedRecord);

  await saveDayRecord(

    user.uid,

    dateKey,

    updatedRecord

  );

  setRecords((previous) => ({

    ...previous,

    [dateKey]: updatedRecord,

  }));

}
/* =========================
   TOGGLE TASK
========================= */

async function toggleTask(taskId) {

  const updatedTasks = tasks.map((task) =>

    task.id === taskId

      ? {

          ...task,

          completed: !task.completed,

        }

      : task

  );

  setTasks(updatedTasks);

  if (!user) return;

const updatedRecord = {
    date: dateKey,
    tasks: updatedTasks,

    breakFree,

    submitted,

    totalTasks: updatedTasks.length,

    completedTasks: updatedTasks.filter(

      (task) => task.completed

    ).length,

    completionPercentage:

      updatedTasks.length === 0

        ? 0

        : Math.round(

            (

              updatedTasks.filter(

                (task) => task.completed

              ).length /

              updatedTasks.length

            ) * 100

          ),

  };

  await saveDayRecord(

    user.uid,

    dateKey,

    updatedRecord

  );

  setRecords((previous) => ({

    ...previous,

    [dateKey]: updatedRecord,

  }));

}

/* =========================
   DELETE TASK
========================= */

async function deleteTask(taskId) {

  const updatedTasks = tasks.filter(

    (task) => task.id !== taskId

  );

  setTasks(updatedTasks);

  if (!user) return;

const updatedRecord = {
    date: dateKey,
    tasks: updatedTasks,

    breakFree,

    submitted,

    totalTasks: updatedTasks.length,

    completedTasks: updatedTasks.filter(

      (task) => task.completed

    ).length,

    completionPercentage:

      updatedTasks.length === 0

        ? 0

        : Math.round(

            (

              updatedTasks.filter(

                (task) => task.completed

              ).length /

              updatedTasks.length

            ) * 100

          ),

  };

  await saveDayRecord(

    user.uid,

    dateKey,

    updatedRecord

  );

  setRecords((previous) => ({

    ...previous,

    [dateKey]: updatedRecord,

  }));

}
/* =========================
   BREAK FREE
========================= */

async function toggleBreakFree(isChecked) {

  setBreakFree(isChecked);

  if (!user) return;

  const updatedTasks = isChecked ? [] : tasks;

  if (isChecked) {
    setTasks([]);
  }

 const updatedRecord = {
    date: dateKey,

    tasks: updatedTasks,

    breakFree: isChecked,

    submitted,

    totalTasks: updatedTasks.length,

    completedTasks: updatedTasks.filter(
      task => task.completed
    ).length,

    completionPercentage:
      updatedTasks.length === 0
        ? 0
        : Math.round(
            (
              updatedTasks.filter(
                task => task.completed
              ).length /
              updatedTasks.length
            ) * 100
          ),

  };

  await saveDayRecord(
    user.uid,
    dateKey,
    updatedRecord
  );

  setRecords(prev => ({
    ...prev,
    [dateKey]: updatedRecord,
  }));

}


/* =========================
   SUBMIT DAY
========================= */
/* =========================
   SUBMIT DAY
========================= */
async function submitDay() {

    if (!user) return;

    const dayRecord = {

        date: dateKey,

        tasks,

        breakFree,

        submitted: true,

        totalTasks,

        completedTasks,

        completionPercentage,

    };

    /* =========================
       Save today's report
    ========================= */

    await saveDayRecord(
        user.uid,
        dateKey,
        dayRecord
    );

    /* =========================
       Update local records
    ========================= */

    const updatedRecords = {

        ...records,

        [dateKey]: dayRecord,

    };

  
    /* =========================
       Calculate Latest Streak
    ========================= */
/* =========================
   Calculate & Save Streak
========================= */

const streakData = await calculateAndSaveStreak(
    user.uid
);

setStreakData(streakData);
console.log(streakData);
  setRecords(updatedRecords);

    setSubmitted(true);

    /* =========================
       Get User Profile
    ========================= */

    const profileRef = doc(
        db,
        "users",
        user.uid
    );

    const profileSnap = await getDoc(
        profileRef
    );

    let fullName =
        user.displayName ||
        user.email.split("@")[0];

    if (profileSnap.exists()) {

        fullName =
            profileSnap.data().fullName;

    }

    /* =========================
       Show Reward Popup
    ========================= */

if (streakData.currentStreak > 0) {

    setRewardData({

        username: fullName,

        streak: streakData.currentStreak,

    });

    setShowReward(true);

}
}

/* =========================
   UI
========================= */

return (

  <div className="calendar-sidebar">

    {/* =========================
        DATE
    ========================= */}

    <div className="calendar-sidebar__header">

      <h2 className="calendar-sidebar__date">

        {selectedDate.toDateString()}

      </h2>

    </div>

    {/* =========================
        TASK INPUT
    ========================= */}

    {!breakFree && !submitted && (

      <div className="calendar-sidebar__input-section">

        <input

          className="calendar-sidebar__task-input"

          type="text"

          placeholder="Enter Task..."

          value={taskInput}

          onChange={(event) =>

            setTaskInput(

              event.target.value

            )

          }

          onKeyDown={(event) => {

            if (event.key === "Enter") {

              addTask();

            }

          }}

        />

        <button

          className="calendar-sidebar__task-add-btn"

          onClick={addTask}

        >

          + Add Task

        </button>

      </div>

    )}
        {/* =========================
        TASK LIST
    ========================= */}

    <div className="calendar-sidebar__task-list">

      {breakFree ? (

        <div className="calendar-sidebar__breakfree-message">

          🌴 Today is a Break Free Day

        </div>

      ) : (

        <>

          {tasks.length === 0 && (

            <div className="calendar-sidebar__no-task">

              No Tasks Added

            </div>

          )}

          {tasks.map((task) => (

            <div

              key={task.id}

              className="calendar-sidebar__task-item"

            >

              <label className="calendar-sidebar__task-label">

                <input

                  type="checkbox"

                  className="calendar-sidebar__task-checkbox"

                  checked={task.completed}

                  onChange={() =>

                    toggleTask(task.id)

                  }

                />

                <span

                  className={`

                    calendar-sidebar__task-title

                    ${

                      task.completed

                        ? "calendar-sidebar__task-title--completed"

                        : ""

                    }

                  `}

                >

                  {task.title}

                </span>

              </label>

              {!submitted && (

                <button

                  className="calendar-sidebar__task-delete-btn"

                  onClick={() =>

                    deleteTask(task.id)

                  }

                >

                  🗑

                </button>

              )}

            </div>

          ))}

        </>

      )}

    </div>

        {/* =========================
        PROGRESS
    ========================= */}
{!breakFree && (

<div className="calendar-sidebar__progress">

      <h3 className="calendar-sidebar__progress-title">

        {completedTasks} / {totalTasks}

      </h3>

      <p className="calendar-sidebar__progress-text">

        {completionPercentage}% Completed

      </p>

      <div className="calendar-sidebar__progress-bar">

        <div

          className="calendar-sidebar__progress-fill"

          style={{

            width: `${completionPercentage}%`

          }}

        />

      </div>

    </div>
    )}

    {/* =========================
    BREAK FREE
========================= */}

{!submitted && (

  <div className="calendar-sidebar__breakfree">

    <label className="calendar-sidebar__breakfree-label">

      <input
        type="checkbox"
        className="calendar-sidebar__breakfree-checkbox"
        checked={breakFree}
        onChange={(e) =>
          toggleBreakFree(e.target.checked)
        }
      />

      <span>🌴 Break Free Day</span>

    </label>

  </div>

)}

        {/* =========================
        SUBMIT DAY
    ========================= */}

    {!submitted ? (

      <button

        className="calendar-sidebar__submit-btn"

        onClick={submitDay}

      >

        Submit Day

      </button>

    ) : (

      <div className="calendar-sidebar__submitted-section">

        <div className="calendar-sidebar__submitted-badge">

          Day Submitted

        </div>

    

        <button

          className="calendar-sidebar__edit-report-btn"

          onClick={() =>

            setSubmitted(false)

          }

        >

          ✏ Edit Report

        </button>

      </div>

    )}

  </div>

);
}