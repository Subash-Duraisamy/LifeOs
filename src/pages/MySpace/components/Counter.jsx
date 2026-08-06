import { useState } from "react";
import "./Counter.css";

function Counter({
  title,
  count,
  onSave,
}) {

  const [editing, setEditing] = useState(false);

  const [value, setValue] = useState(count);

  function increase() {
    setValue((prev) => prev + 1);
  }

  function decrease() {
    setValue((prev) => Math.max(0, prev - 1));
  }

  function handleEdit() {
    setValue(count);
    setEditing(true);
  }

  function handleCancel() {
    setValue(count);
    setEditing(false);
  }

  async function handleSave() {

    await onSave(value);

    setEditing(false);

  }

  return (

    <div className="counter-card">

      <h3 className="counter-title">
        {title}
      </h3>

      <div className="counter-number">
        {editing ? value : count}
      </div>

      <p className="counter-owned">
        Owned
      </p>

      {!editing ? (

        <button
          className="edit-counter-btn"
          onClick={handleEdit}
        >
          ✏️ Edit
        </button>

      ) : (

        <>

          <div className="counter-actions">

            <button
              className="minus-btn"
              onClick={decrease}
            >
              −
            </button>

            <button
              className="plus-btn"
              onClick={increase}
            >
              +
            </button>

          </div>

          <div className="counter-bottom">

            <button
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              className="save-btn"
              onClick={handleSave}
            >
              Save
            </button>

          </div>

        </>

      )}

    </div>

  );

}

export default Counter;