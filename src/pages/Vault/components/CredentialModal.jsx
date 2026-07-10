import { useEffect, useState } from "react";

import "./CredentialModal.css";

function CredentialModal({

  open,

  onClose,

  onSave,

  credential,

}) {

  const [data, setData] = useState({

    appName: "",

    website: "",

    username: "",

    password: "",

    notes: "",

    category: "General",

    favorite: false,

  });

  useEffect(() => {

    if (credential) {

      setData({

        appName: credential.appName || "",

        website: credential.website || "",

        username: credential.username || "",

        password: credential.password || "",

        notes: credential.notes || "",

        category:
          credential.category || "General",

        favorite:
          credential.favorite || false,

      });

    }

    else {

      setData({

        appName: "",

        website: "",

        username: "",

        password: "",

        notes: "",

        category: "General",

        favorite: false,

      });

    }

  }, [credential, open]);

  if (!open) return null;

  function handleChange(e) {

    const { name, value, type, checked } =
      e.target;

    setData((prev) => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));

  }

  function handleSubmit() {

    if (!data.appName.trim()) {

      alert("App Name is required.");

      return;

    }

    if (!data.username.trim()) {

      alert("Username is required.");

      return;

    }

    if (!data.password.trim()) {

      alert("Password is required.");

      return;

    }

    onSave(data);

  }

  return (

    <div
      className="credential-overlay"
      onClick={onClose}
    >

      <div
        className="credential-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="credential-header">

          <h2>

            {credential

              ? "✏ Edit Credential"

              : "➕ Add Credential"}

          </h2>

        </div>

        <div className="credential-body">

          <div className="credential-group">

            <label>

              App Name *

            </label>

            <input

              name="appName"

              value={data.appName}

              onChange={handleChange}

              placeholder="Github"

            />

          </div>

          <div className="credential-group">

            <label>

              Website

            </label>

            <input

              name="website"

              value={data.website}

              onChange={handleChange}

              placeholder="https://github.com"

            />

          </div>

          <div className="credential-group">

            <label>

              Username / Email *

            </label>

            <input

              name="username"

              value={data.username}

              onChange={handleChange}

            />

          </div>

          <div className="credential-group">

            <label>

              Password *

            </label>

            <input

              type="password"

              name="password"

              value={data.password}

              onChange={handleChange}

            />

          </div>

          <div className="credential-group">

            <label>

              Category

            </label>

            <select

              name="category"

              value={data.category}

              onChange={handleChange}

            >

              <option>

                General

              </option>

              <option>

                Social

              </option>

              <option>

                Development

              </option>

              <option>

                Banking

              </option>

              <option>

                Shopping

              </option>

              <option>

                Entertainment

              </option>

              <option>

                Education

              </option>

            </select>

          </div>

          <div className="credential-group">

            <label>

              Notes

            </label>

            <textarea

              rows="3"

              name="notes"

              value={data.notes}

              onChange={handleChange}

            />

          </div>

          <label className="favorite-row">

            <input

              type="checkbox"

              name="favorite"

              checked={data.favorite}

              onChange={handleChange}

            />

            ⭐ Favorite

          </label>

        </div>

        <div className="credential-footer">

          <button

            className="cancel-btn"

            onClick={onClose}

          >

            Cancel

          </button>

          <button

            className="save-btn"

            onClick={handleSubmit}

          >

            Save

          </button>

        </div>

      </div>

    </div>

  );

}

export default CredentialModal;