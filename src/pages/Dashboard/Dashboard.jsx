import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getUser } from "../../services/authService";
import { getTasks } from "../../services/taskService";

import "./Dashboard.css";

function Dashboard() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      const userData = await getUser(user.uid);
      setProfile(userData);

      const taskData = await getTasks(user.uid);
      setTasks(taskData);
    }

    loadData();
  }, [user]);

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return "Good Morning ☀️";
    if (hour >= 12 && hour < 17) return "Good Afternoon 🌤️";
    if (hour >= 17 && hour < 21) return "Good Evening 🌇";

    return "Good Night 🌙";
  }

  const today = new Date().toISOString().split("T")[0];

  const todaysTasks = tasks.filter(
    (task) => task.startDate === today
  );

  return (
    <div className="dashboard">
      <section className="welcome-card">
        <div>
          <h1>{getGreeting()}</h1>

          <h2>{profile?.fullName || "Loading..."}</h2>

          <p>
            Welcome back to LifeOS.
            <br />
            Let's make today productive.
          </p>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="card">
          <h2>Today's Tasks</h2>

          {todaysTasks.length === 0 ? (
            <p className="no-task">No tasks for today.</p>
          ) : (
            <div className="task-list">
              {todaysTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-chip ${task.priority.toLowerCase()}`}
                >
                  {task.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;