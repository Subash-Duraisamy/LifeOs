import "./SuccessModal.css";
import { CircleCheckBig } from "lucide-react";

function SuccessModal({

  open,

  title,

  message,

  onClose,

}) {

  if (!open) return null;

  return (

    <div className="success-overlay">

      <div className="success-modal">

        <div className="success-circle">

          <CircleCheckBig size={58} />

        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <button

          className="success-btn"

          onClick={onClose}

        >

          Continue

        </button>

      </div>

    </div>

  );

}

export default SuccessModal;