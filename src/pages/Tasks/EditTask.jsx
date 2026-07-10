import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import TaskForm from "../../components/Tasks/TaskForm";

import {
  getTaskById,
  updateTask,
} from "../../services/taskService";

function EditTask() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [task, setTask] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await getTaskById(id);

        if (!data) {
          alert("Task not found");
          navigate("/tasks");
          return;
        }

        setTask(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load task");
        navigate("/tasks");
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id, navigate]);

  async function handleUpdateTask(updatedTask) {
    try {
      await updateTask(id, updatedTask);

      navigate("/tasks");
    } catch (error) {
      console.error(error);
      alert("Failed to update task");
    }
  }

  if (loading) {
    return <p>Loading task...</p>;
  }

  return (
    <TaskForm
      initialData={task}
      onSave={handleUpdateTask}
    />
  );
}

export default EditTask;