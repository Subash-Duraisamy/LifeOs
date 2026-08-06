import { useEffect, useState } from "react";

import "./LibraryModal.css";

function LibraryModal({
  open,
  mode,
  type,
  item,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [current, setCurrent] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setImage(item.image);
      setCurrent(item.current);
    } else {
      setTitle("");
      setImage("");
      setCurrent(false);
    }
  }, [item]);

  if (!open) return null;

  function handleSave() {
    onSave({
      title,
      image,
      current,
    });
  }

  return (
    <div className="library-modal-overlay">

      <div className="library-modal">

        <h2>

          {mode === "edit"
            ? "Edit"
            : "Add"}

          {" "}

          {type}

        </h2>

        <label>

          Title

          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

        </label>

        <label>

          Image URL

          <input
            type="text"
            placeholder="https://..."
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
          />

        </label>

        <label className="checkbox">

          <input
            type="checkbox"
            checked={current}
            onChange={(e) =>
              setCurrent(e.target.checked)
            }
          />

          Make this Current

        </label>

        <div className="modal-buttons">

          <button
            className="cancel-btn"
            onClick={onClose}
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

      </div>

    </div>
  );
}

export default LibraryModal;