import "./TaskCard.css";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import Swal from "sweetalert2";

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
  async function handleDelete() {

    const result = await Swal.fire({

        title: "Delete Task?",

        html: `
            <div style="font-size:15px;">
                Are you sure you want to delete this task?<br><br>
                <span style="color:#ff8a8a">
                    This action cannot be undone.
                </span>
            </div>
        `,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "🗑 Delete",

        cancelButtonText: "Cancel",

        reverseButtons: true,

        background: "#171d2e",

        color: "#ffffff",
        customClass: {

            popup: "lifeos-popup",

            confirmButton: "lifeos-delete",

            cancelButton: "lifeos-cancel",

        },

        confirmButtonColor: "#ef4444",

        cancelButtonColor: "#4f7cff",

        backdrop: `
            rgba(5,10,25,0.75)
            backdrop-filter: blur(8px)
        `,

    });

    if (result.isConfirmed) {

        onDelete(task.id);

        Swal.fire({

            icon: "success",

            title: "Deleted!",

            text: "Task deleted successfully.",

            background: "#171d2e",

            color: "#ffffff",

            confirmButtonText: "OK",

            confirmButtonColor: "#4f7cff",

        });

    }

}

  return (

    <div className="task-card">

      <div className="task-left">

        <h3 className="task-title">
          {task.title}
        </h3>

        {task.description && (

          <p className="task-description">
            {task.description}
          </p>

        )}

        <div className="task-info">

          <span>
            📁 {task.category}
          </span>

          <span>
            📅 {task.startDate || "No Date"}
          </span>

          {task.startTime && (

            <span>
              🕒 {formatTime(task.startTime)}
            </span>

          )}

          {task.endTime && (

            <span>
              ⏰ {formatTime(task.endTime)}
            </span>

          )}

          {task.tags && (

            <span>
              🏷️ {task.tags}
            </span>

          )}

        </div>

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

        <div className="task-meta">

          <span
            className={`priority ${task.priority?.toLowerCase()}`}
          >
            {task.priority}
          </span>

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
            className="icon-btn task-card-edit-btn"
            onClick={() => onEdit(task)}
            title="Edit Task"
          >

            <Pencil size={18} />

          </button>

<button
    className="icon-btn task-card-delete-btn"
    onClick={handleDelete}
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