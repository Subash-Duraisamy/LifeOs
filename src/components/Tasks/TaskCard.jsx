import "./TaskCard.css";
import { Pencil, Trash2, ExternalLink } from "lucide-react";

function TaskCard({
  task,
  onEdit,
  onDelete,
}) {

  function formatTime(time) {
    if (!time) return "";

    const [hour, minute] = time.split(":");

    const date = new Date();

    date.setHours(Number(hour));
    date.setMinutes(Number(minute));

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="task-card">

      <div className="task-left">

        <div className="task-title-row">

          <h3>{task.title}</h3>

          <span className={`priority ${task.priority?.toLowerCase()}`}>
            {task.priority}
          </span>

        </div>

        {task.description && (
          <p className="task-description">
            {task.description}
          </p>
        )}

        <div className="task-info">

          <span>📁 {task.category}</span>

          <span>📅 {task.startDate || "No Date"}</span>

          {task.startTime && (
            <span>🕒 {formatTime(task.startTime)}</span>
          )}

          {task.endTime && (
            <span>⏰ {formatTime(task.endTime)}</span>
          )}

          {task.tags && (
            <span>🏷️ {task.tags}</span>
          )}

        </div>

        {/* Link */}

        {task.url && (
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="task-link"
          >
            <ExternalLink size={15} />

            {task.linkName || "Open Link"}
          </a>
        )}

      </div>

      <div className="task-right">

        <div className="task-status">

          {task.completed ? (
            <span className="completed">
              ✅ Completed
            </span>
          ) : (
            <span className="pending">
              ⏳ Pending
            </span>
          )}

        </div>

        <div className="task-actions">

          <button
            className="icon-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            <Pencil size={18} />
          </button>

          <button
            className="icon-btn delete-btn"
            onClick={() => onDelete(task.id)}
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}

export default TaskCard;