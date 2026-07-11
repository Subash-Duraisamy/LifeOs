import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import { getUser } from "../../services/authService";
import { getTasks } from "../../services/taskService";
import { getLibrary } from "../../services/libraryService";
import { getFriendsDashboard } from "../../services/friendDashboardService";

import "./Dashboard.css";

function Dashboard() {

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const [tasks, setTasks] = useState([]);

  const [library, setLibrary] = useState([]);

  const [friends, setFriends] = useState([]);

  useEffect(() => {

    async function loadData() {

      if (!user) return;

      try {

        const userData =
          await getUser(user.uid);

        setProfile(userData);

        const taskData =
          await getTasks(user.uid);

        setTasks(taskData);

        const libraryData =
          await getLibrary(user.uid);

        setLibrary(libraryData);

        const friendsData =
          await getFriendsDashboard(user.uid);

        setFriends(friendsData);

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
            {/* =======================================
          Friends Activity
      ======================================== */}

      <section className="friends-dashboard">

        <h2>

          👥 Friends Activity

        </h2>

        {

          friends.length === 0 && (

            <p className="no-task">

              No friends yet.

            </p>

          )

        }

        {

          friends.map(friend => (

<div
  key={friend.uid}
  className="friend-card"
>

  {/* ===========================
      Friend Header
  ============================ */}

  <div className="friend-header">

    <img
      src={
        friend.photoURL ||
        `https://ui-avatars.com/api/?name=${friend.fullName}`
      }
      alt={friend.fullName}
    />

    <div>

      <h3>
        {friend.fullName}
      </h3>

      <p>
        @{friend.username}
      </p>

    </div>

  </div>

  {/* ===========================
      Horizontal Content
  ============================ */}

  <div className="friend-content">

    {/* Today's Tasks */}

    <div className="friend-section">

      <h4>📝 Tasks</h4>

      {

        friend.todaysTasks.length === 0

        ?

        (

          <p>No Tasks</p>

        )

        :

        (

          <div className="task-list">

            {

              friend.todaysTasks.map(task => (

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

    {/* Current Book */}

    <div className="friend-section">

      <h4>📖 Book</h4>

      {

        friend.currentBook

        ?

        (

          <>

            <img

              src={friend.currentBook.image}

              alt={friend.currentBook.title}

              className="friend-media"

            />

            <p>

              {friend.currentBook.title}

            </p>

          </>

        )

        :

        (

          <p>None</p>

        )

      }

    </div>

    {/* Current Movie */}

    <div className="friend-section">

      <h4>🎬 Movie</h4>

      {

        friend.currentMovie

        ?

        (

          <>

            <img

              src={friend.currentMovie.image}

              alt={friend.currentMovie.title}

              className="friend-media"

            />

            <p>

              {friend.currentMovie.title}

            </p>

          </>

        )

        :

        (

          <p>None</p>

        )

      }

    </div>

    {/* Current Course */}

    <div className="friend-section">

      <h4>🎓 Course</h4>

      {

        friend.currentCourse

        ?

        (

          <>

            <img

              src={friend.currentCourse.image}

              alt={friend.currentCourse.title}

              className="friend-media"

            />

            <p>

              {friend.currentCourse.title}

            </p>

          </>

        )

        :

        (

          <p>None</p>

        )

      }

    </div>

  </div>

</div>

          ))

        }

      </section>
          </div>

  );

}

export default Dashboard;