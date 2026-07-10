import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getUser } from "../../services/authService";

import "./Dashboard.css";

function Dashboard() {

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  useEffect(() => {

    async function loadUser() {

      if (!user) return;

      const data = await getUser(user.uid);

      setProfile(data);

    }

    loadUser();

  }, [user]);

  return (

    <div className="dashboard">

      <section className="welcome-card">

        <div>

          <h1>Good Evening 👋</h1>

          <h2>

            {profile?.fullName || "Loading..."}

          </h2>

          <p>

            Welcome back to LifeOS.

            Let's make today productive.

          </p>

        </div>

      </section>

      <section className="quick-actions">

        <button>➕ Add Task</button>

        <button>📝 Journal</button>

        <button>💰 Expense</button>

        <button>🎯 Goal</button>

      </section>

      <section className="stats">

        <div className="stat-card">

          <h3>🔥 Streak</h3>

          <span>25 Days</span>

        </div>

        <div className="stat-card">

          <h3>✅ Tasks</h3>

          <span>8</span>

        </div>

        <div className="stat-card">

          <h3>💰 Expense</h3>

          <span>₹350</span>

        </div>

        <div className="stat-card">

          <h3>📅 Events</h3>

          <span>3</span>

        </div>

      </section>

      <section className="dashboard-grid">

        <div className="card">
          <h2>Today's Tasks</h2>
        </div>

        <div className="card">
          <h2>Calendar</h2>
        </div>

        <div className="card">
          <h2>Habits</h2>
        </div>

        <div className="card">
          <h2>Journal</h2>
        </div>

        <div className="card">
          <h2>Expenses</h2>
        </div>

        <div className="card">
          <h2>AI Assistant</h2>
        </div>

      </section>

    </div>

  );

}

export default Dashboard;