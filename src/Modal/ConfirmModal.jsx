import "./ConfirmModal.css";

function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">

      <div className="confirm-modal">

        <div className="modal-icon">
          🚪
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-buttons">

          <button
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="confirm-button"
            onClick={onConfirm}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConfirmModal;