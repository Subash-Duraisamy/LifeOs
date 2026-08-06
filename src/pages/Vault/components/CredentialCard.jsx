import { useState } from "react";

import "./CredentialCard.css";

function CredentialCard({

  credential,

  onEdit,

  onDelete,

}) {

  const [showPassword, setShowPassword] =
    useState(false);

  function copy(text) {

    navigator.clipboard.writeText(text);

    alert("Copied!");

  }

  return (

    <div className="credential-card">

      <div className="credential-top">

        <div>

          <h3>

            {credential.appName}

          </h3>

          <p>

            🌐 {credential.website || "No Website"}

          </p>

        </div>

        {credential.favorite && (

          <span className="favorite">

            ⭐

          </span>

        )}

      </div>

      <div className="credential-body">

        <div className="credential-row">

          <label>

            Username

          </label>

          <span>

            {credential.username}

          </span>

        </div>

        <div className="credential-row">

          <label>

            Password

          </label>

          <span>

            {showPassword

              ? credential.password

              : "••••••••••"}

          </span>

        </div>

        <div className="credential-row">

          <label>

            Category

          </label>

          <span>

            {credential.category}

          </span>

        </div>

      </div>

      <div className="credential-actions">

        <button

          className="view-btn"

          onClick={() =>

            setShowPassword(

              !showPassword

            )

          }

        >

          {showPassword

            ? "🙈 Hide"

            : "👁 Show"}

        </button>

        <button

          className="copy-btn"

          onClick={() =>

            copy(

              credential.password

            )

          }

        >

          📋 Copy

        </button>

      </div>

      <div className="credential-footer">

        <button

          className="edit-btn"

          onClick={() =>

            onEdit(credential)

          }

        >

          ✏ Edit

        </button>

        <button

          className="delete-btn"

          onClick={() =>

            onDelete(

              credential.id

            )

          }

        >

          🗑 Delete

        </button>

      </div>

    </div>

  );

}

export default CredentialCard;