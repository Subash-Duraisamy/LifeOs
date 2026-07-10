import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./TaskForm.css";

function TaskForm({ onSave, initialData = null }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Personal");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeat, setRepeat] = useState("Never");
  const [linkName, setLinkName] = useState("");
  const [url, setUrl] = useState("");
  const [assignMember, setAssignMember] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");

  const isEditing = initialData !== null;

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
    setPriority(initialData.priority || "Medium");
    setCategory(initialData.category || "Personal");
    setStartDate(initialData.startDate || "");
    setEndDate(initialData.endDate || "");
    setStartTime(initialData.startTime || "");
    setEndTime(initialData.endTime || "");
    setRepeat(initialData.repeat || "Never");
    setLinkName(initialData.linkName || "");
    setUrl(initialData.url || "");
    setAssignMember(initialData.assignMember || "");
    setTags(initialData.tags || "");
    setNotes(initialData.notes || "");
  }, [initialData]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCategory("Personal");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
    setRepeat("Never");
    setLinkName("");
    setUrl("");
    setAssignMember("");
    setTags("");
    setNotes("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task title is required.");
      return;
    }

    const task = {
      ...initialData,
      title,
      description,
      priority,
      category,
      startDate,
      endDate,
      startTime,
      endTime,
      repeat,
      linkName,
      url,
      assignMember,
      tags,
      notes,
    };

    if (onSave) {
      await onSave(task);
    }

    alert(
      isEditing
        ? "Task updated successfully!"
        : "Task created successfully!"
    );

    resetForm();

    navigate("/tasks");
  }

  function handleCancel() {
    navigate("/tasks");
  }

  return (
    <form className="task-form-card" onSubmit={handleSubmit}>
      <h2>
        {isEditing ? "Edit Task" : "Create New Task"}
      </h2>

      <div className="form-group">
        <label>Task Title *</label>

        <textarea
          rows="2"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Description</label>

        <textarea
          rows="5"
          placeholder="Describe your task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="task-row">
        <div className="form-group">
          <label>Priority</label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Personal</option>
            <option>Work</option>
            <option>College</option>
            <option>Fitness</option>
            <option>Finance</option>
          </select>
        </div>
      </div>

      <div className="task-row">
        <div className="form-group">
          <label>Start Date</label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>End Date</label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="task-row">
        <div className="form-group">
          <label>Start Time</label>

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>End Time</label>

          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Repeat</label>

        <select
          value={repeat}
          onChange={(e) => setRepeat(e.target.value)}
        >
          <option>Never</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      <div className="form-group">
        <label>Link Name</label>

        <input
          type="text"
          placeholder="React Documentation"
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>URL</label>

        <input
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Assign Member</label>

        <input
          type="text"
          placeholder="Username"
          value={assignMember}
          onChange={(e) => setAssignMember(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Tags</label>

        <input
          type="text"
          placeholder="React, Placement..."
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Notes</label>

        <textarea
          rows="4"
          placeholder="Additional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="button-row">
        <button
          type="button"
          className="cancel-btn"
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="add-btn"
        >
          {isEditing ? "💾 Update Task" : "➕ Create Task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;