import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import {
  getTasks,
  deleteTask,
} from "../../services/taskService";

import TaskCard from "../../components/Tasks/TaskCard";

import "./Tasks.css";

function Tasks() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] =useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [sort, setSort] = useState("Newest");

  useEffect(() => {
    async function loadTasks() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getTasks(user.uid);
        setTasks(data);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }

    loadTasks();
  }, [user]);

  async function handleDelete(id) {
    const ok = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!ok) return;

    try {
      await deleteTask(id);

      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      );

      alert("Task deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete task.");
    }
  }

  function handleEdit(task) {
    navigate(`/tasks/edit/${task.id}`);
  }

  let filteredTasks = [...tasks];

  /* Search */

  if (search.trim()) {
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        task.description
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        task.category
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        task.tags
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }

  /* Filter */

  if (filter === "Completed") {
    filteredTasks = filteredTasks.filter(
      (task) => task.completed
    );
  }

  if (filter === "Pending") {
    filteredTasks = filteredTasks.filter(
      (task) => !task.completed
    );
  }

  if (
    [
      "Personal",
      "Work",
      "College",
      "Fitness",
      "Finance",
    ].includes(filter)
  ) {
    filteredTasks = filteredTasks.filter(
      (task) => task.category === filter
    );
  }

  /* Sort */

  if (sort === "Newest") {
    filteredTasks.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;

      return (
        b.createdAt.seconds -
        a.createdAt.seconds
      );
    });
  }

  if (sort === "Oldest") {
    filteredTasks.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;

      return (
        a.createdAt.seconds -
        b.createdAt.seconds
      );
    });
  }

  if (sort === "A-Z") {
    filteredTasks.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  if (sort === "Priority") {
    const priorityOrder = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    filteredTasks.sort(
      (a, b) =>
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
    );
  }

  return (
    <div className="tasks-page">

      <div className="tasks-header">

        <h1>Tasks</h1>

        <button
          className="create-task-btn"
          onClick={() =>
            navigate("/tasks/create")
          }
        >
          + Create Task
        </button>

      </div>

      <div className="tasks-toolbar">

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Personal</option>
          <option>Work</option>
          <option>College</option>
          <option>Fitness</option>
          <option>Finance</option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option>Newest</option>
          <option>Oldest</option>
          <option>A-Z</option>
          <option>Priority</option>
        </select>

      </div>

      {loading ? (

        <p>Loading tasks...</p>

      ) : filteredTasks.length === 0 ? (

        <div className="empty-state">

          <h2>No Tasks Yet</h2>

          <p>
            Create your first task and start being productive.
          </p>

          <button
            className="create-task-btn"
            onClick={() =>
              navigate("/tasks/create")
            }
          >
            Create First Task
          </button>

        </div>

      ) : (

        <div className="task-list">

          {filteredTasks.map((task) => (

            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

          ))}

        </div>

      )}

    </div>
  );
}

export default Tasks;