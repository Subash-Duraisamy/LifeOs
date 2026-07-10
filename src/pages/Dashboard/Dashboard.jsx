import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import { getUser } from "../../services/authService";
import { getTasks } from "../../services/taskService";
import { getLibrary } from "../../services/libraryService";

import "./Dashboard.css";

function Dashboard() {

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [library, setLibrary] = useState([]);

  useEffect(() => {

    async function loadData() {

      if (!user) return;

      try {

        const userData = await getUser(user.uid);
        setProfile(userData);

        const taskData = await getTasks(user.uid);
        setTasks(taskData);

        const libraryData = await getLibrary(user.uid);
        setLibrary(libraryData);

      }

      catch (error) {

        console.error(error);

      }

    }

    loadData();

  }, [user]);

  function getGreeting() {

    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12)
      return "Good Morning ☀️";

    if (hour >= 12 && hour < 17)
      return "Good Afternoon 🌤️";

    if (hour >= 17 && hour < 21)
      return "Good Evening 🌇";

    return "Good Night 🌙";

  }

  const today =
    new Date().toISOString().split("T")[0];

  const todaysTasks = tasks.filter(
    task => task.startDate === today
  );

  const currentBook = library.find(
    item =>
      item.type === "book" &&
      item.current
  );

  const currentMovie = library.find(
    item =>
      item.type === "movie" &&
      item.current
  );

  const currentCourse = library.find(
    item =>
      item.type === "course" &&
      item.current
  );

  return (

    <div className="dashboard">

      {/* =======================================
          Welcome
      ======================================== */}

      <section className="welcome-card">

        <div>

          <h1>

            {getGreeting()}

          </h1>

          <h2>

            {profile?.fullName || "Loading..."}

          </h2>

          <p>

            Welcome back to LifeOS.

            <br />

            Let's make today productive.

          </p>

        </div>

      </section>

      {/* =======================================
          Dashboard Grid
      ======================================== */}

      <section className="dashboard-grid">

        {/* Today's Tasks */}

        <div className="card">

          <h2>

            Today's Tasks

          </h2>

          {

            todaysTasks.length === 0

            ?

            (

              <p className="no-task">

                No tasks for today.

              </p>

            )

            :

            (

              <div className="task-list">

                {

                  todaysTasks.map(task => (

                    <div
                      key={task.id}
                      className={`task-chip ${task.priority.toLowerCase()}`}
                    >

                      {task.title}

                    </div>

                  ))

                }

              </div>

            )

          }

        </div>

        {/* =======================================
            Current Book
        ======================================== */}

        {

          currentBook && (

            <div className="card">

              <h2>

                📖 Current Book

              </h2>

              <div className="library-widget">

                <img
                  src={currentBook.image}
                  alt={currentBook.title}
                />

                <h3>

                  {currentBook.title}

                </h3>

              </div>

            </div>

          )

        }

        {/* =======================================
            Current Movie
        ======================================== */}

        {

          currentMovie && (

            <div className="card">

              <h2>

                🎬 Current Movie

              </h2>

              <div className="library-widget">

                <img
                  src={currentMovie.image}
                  alt={currentMovie.title}
                />

                <h3>

                  {currentMovie.title}

                </h3>

              </div>

            </div>

          )

        }

        {/* =======================================
            Current Course
        ======================================== */}

        {

          currentCourse && (

            <div className="card">

              <h2>

                🎓 Current Course

              </h2>

              <div className="library-widget">

                <img
                  src={currentCourse.image}
                  alt={currentCourse.title}
                />

                <h3>

                  {currentCourse.title}

                </h3>

              </div>

            </div>

          )

        }

      </section>

    </div>

  );

}

export default Dashboard;