import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

    await Swal.fire({

        icon: "warning",

        title: "Task Title Required",

        text: "Please enter a task title.",

        background: "#1b2235",

        color: "#ffffff",

        confirmButtonText: "OK",

        confirmButtonColor: "#4f7cff",

    });

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

await Swal.fire({

    icon: "success",

    title: isEditing
        ? "Task Updated"
        : "Task Created",

    text: isEditing
        ? "Your task has been updated successfully."
        : "Your task has been created successfully.",

    background: "#1b2235",

    color: "#ffffff",

    confirmButtonText: "OK",

    confirmButtonColor: "#4f7cff",

});

        resetForm();

        navigate("/tasks");

    }

    function handleCancel() {

        navigate("/tasks");

    }

    return (

        <form
            className="task-create-form"
            onSubmit={handleSubmit}
        >

            <h2 className="task-create-title">

                {isEditing
                    ? "Edit Task"
                    : "Create New Task"}

            </h2>

            {/* ======================================= */}
            {/* TASK TITLE */}
            {/* ======================================= */}

            <div className="task-create-group">

                <label className="task-create-label">

                    Task Title *

                </label>

                <textarea
                    className="task-create-textarea"
                    rows={2}
                    placeholder="Enter task title..."
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />

            </div>

            {/* ======================================= */}
            {/* DESCRIPTION */}
            {/* ======================================= */}

            <div className="task-create-group">

                <label className="task-create-label">

                    Description

                </label>

                <textarea
                    className="task-create-textarea"
                    rows={5}
                    placeholder="Describe your task..."
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                />

            </div>

            {/* ======================================= */}
            {/* PRIORITY + CATEGORY */}
            {/* ======================================= */}

            <div className="task-create-row">

                <div className="task-create-group">

                    <label className="task-create-label">

                        Priority

                    </label>

                    <select
                        className="task-create-select"
                        value={priority}
                        onChange={(e)=>setPriority(e.target.value)}
                    >

                        <option value="Low">
                            🟢 Low
                        </option>

                        <option value="Medium">
                            🟡 Medium
                        </option>

                        <option value="High">
                            🔴 High
                        </option>

                    </select>

                </div>

                <div className="task-create-group">

                    <label className="task-create-label">

                        Category

                    </label>

                    <select
                        className="task-create-select"
                        value={category}
                        onChange={(e)=>setCategory(e.target.value)}
                    >

                        <option>Personal</option>
                        <option>Work</option>
                        <option>College</option>
                        <option>Fitness</option>
                        <option>Finance</option>

                    </select>

                </div>

            </div>

                        {/* ======================================= */}
            {/* START DATE + END DATE */}
            {/* ======================================= */}

            <div className="task-create-row">

                <div className="task-create-group">

                    <label className="task-create-label">
                        Start Date
                    </label>

                    <input
                        className="task-create-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />

                </div>

                <div className="task-create-group">

                    <label className="task-create-label">
                        End Date
                    </label>

                    <input
                        className="task-create-input"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />

                </div>

            </div>

            {/* ======================================= */}
            {/* START TIME + END TIME */}
            {/* ======================================= */}

            <div className="task-create-row">

                <div className="task-create-group">

                    <label className="task-create-label">
                        Start Time
                    </label>

                    <input
                        className="task-create-input"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />

                </div>

                <div className="task-create-group">

                    <label className="task-create-label">
                        End Time
                    </label>

                    <input
                        className="task-create-input"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />

                </div>

            </div>

            {/* ======================================= */}
            {/* REPEAT */}
            {/* ======================================= */}

            <div className="task-create-group">

                <label className="task-create-label">
                    Repeat
                </label>

                <select
                    className="task-create-select"
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

            {/* ======================================= */}
            {/* LINK NAME */}
            {/* ======================================= */}

            <div className="task-create-group">

                <label className="task-create-label">
                    Link Name
                </label>

                <input
                    className="task-create-input"
                    type="text"
                    placeholder="React Documentation"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                />

            </div>

            {/* ======================================= */}
            {/* URL */}
            {/* ======================================= */}

            <div className="task-create-group">

                <label className="task-create-label">
                    URL
                </label>

                <input
                    className="task-create-input"
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

            </div>
                        {/* ======================================= */}
            {/* ASSIGN MEMBER */}
            {/* ======================================= */}

            <div className="task-create-group">

                <label className="task-create-label">
                    Assign Member
                </label>

                <input
                    className="task-create-input"
                    type="text"
                    placeholder="Username"
                    value={assignMember}
                    onChange={(e) => setAssignMember(e.target.value)}
                />

            </div>

            {/* ======================================= */}
            {/* TAGS */}
            {/* ======================================= */}

            <div className="task-create-group">

                <label className="task-create-label">
                    Tags
                </label>

                <input
                    className="task-create-input"
                    type="text"
                    placeholder="React, Placement, Exam..."
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />

            </div>

            {/* ======================================= */}
            {/* NOTES */}
            {/* ======================================= */}

            <div className="task-create-group">

                <label className="task-create-label">
                    Notes
                </label>

                <textarea
                    className="task-create-textarea"
                    rows={4}
                    placeholder="Write additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

            </div>

            {/* ======================================= */}
            {/* ACTION BUTTONS */}
            {/* ======================================= */}

            <div className="task-create-buttons">

                <button
                    type="button"
                    className="task-create-cancel"
                    onClick={handleCancel}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="task-create-submit"
                >
                    {isEditing
                        ? (
                            <>
                                💾 <span>Update Task</span>
                            </>
                        )
                        : (
                            <>
                                ➕ <span>Create Task</span>
                            </>
                        )}
                </button>

            </div>

        </form>

    );

}

export default TaskForm;