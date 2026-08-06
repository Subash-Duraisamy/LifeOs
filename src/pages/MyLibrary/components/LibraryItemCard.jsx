import "./LibraryItemCard.css";

function LibraryItemCard({
  title,
  image,
  current = false,
  onEdit,
  onDelete,
  onComplete,
  onMoveUp,
  onMoveDown,
}) {
  return (
    <div className="library-item-card">

      <img
        src={
          image ||
          "https://placehold.co/130x180?text=No+Image"
        }
        alt={title}
        className="library-item-image"
      />

      <div className="library-item-info">

        <h3>{title}</h3>

        {current && (
          <span className="current-badge">
            Current
          </span>
        )}

        <div className="library-buttons">

          <button
            className="edit-btn"
            onClick={onEdit}
          >
            ✏ Edit
          </button>

          <button
            className="complete-btn"
            onClick={onComplete}
          >
            ✅ Finished
          </button>

          <button
            className="delete-btn"
            onClick={onDelete}
          >
            🗑 Delete
          </button>

        </div>

        {!current && (

          <div className="move-buttons">

            <button
              onClick={onMoveUp}
            >
              ⬆
            </button>

            <button
              onClick={onMoveDown}
            >
              ⬇
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default LibraryItemCard;