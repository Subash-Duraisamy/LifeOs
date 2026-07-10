import { useNavigate } from "react-router-dom";

import TaskForm from "../../components/Tasks/TaskForm";
import { useAuth } from "../../hooks/useAuth";
import { createTask } from "../../services/taskService";

function CreateTask() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleCreateTask(task) {
    try {
      if (!user) {
        alert("Please login first.");
        return;
      }

      await createTask(user.uid, task);

      navigate("/tasks");
    } catch (error) {
      console.error("Create Task Error:", error);
      alert("Failed to create task.");
    }
  }

  return (
    <TaskForm
      onSave={handleCreateTask}
    />
  );
}

export default CreateTask;