import { useEffect, useState } from "react";
import "./ProfileModal.css";

function ProfileModal({
  open,
  user,
  onClose,
  onSave,
  onDelete,
}) {

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState("");

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  useEffect(() => {

    if (open && user) {

      setFullName(user.fullName || "");

      setUsername(user.username || "");

      setPhotoURL(user.photoURL || "");

      setBio(user.bio || "");

    }

  }, [open, user]);

  if (!open) return null;

  function handleSave() {

    onSave({

      fullName,

      username,

      photoURL,

      bio,

    });

    setShowSaveConfirm(false);

  }

  return (

    <div
      className="profile-overlay"
      onClick={onClose}
    >

      <div
        className="profile-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <button
          className="close-profile"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="profile-header">

          <div className="profile-avatar">

            {photoURL ? (

              <img
                src={photoURL}
                alt="Profile"
              />

            ) : (

              <span>

                {(fullName || "U")
                  .charAt(0)
                  .toUpperCase()}

              </span>

            )}

          </div>

          <h2>My Profile</h2>

        </div>

        <div className="profile-body">

          <div className="profile-group">

            <label>Full Name</label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
            />

          </div>

          <div className="profile-group">

            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

          </div>

          <div className="profile-group">

            <label>Email</label>

            <input
              type="email"
              value={user?.email || ""}
              disabled
            />

          </div>

          <div className="profile-group">

            <label>Photo URL</label>

            <input
              type="text"
              placeholder="https://..."
              value={photoURL}
              onChange={(e) =>
                setPhotoURL(e.target.value)
              }
            />

          </div>

          <div className="profile-group">

            <label>Bio</label>

            <textarea
              rows="4"
              placeholder="Tell something about yourself..."
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
            />

          </div>

        </div>

        <div className="profile-actions">

          <button
            className="profile-save-fab"
            onClick={() =>
              setShowSaveConfirm(true)
            }
          >
            💾 Save Changes
          </button>

          <button
            className="profile-delete-fab"
            onClick={onDelete}
          >
            🗑 Delete Account
          </button>

        </div>

      </div>

      {/* ===============================
          SAVE CONFIRMATION MODAL
      =============================== */}

      {showSaveConfirm && (

        <div
          className="confirm-overlay"
          onClick={() =>
            setShowSaveConfirm(false)
          }
        >

          <div
            className="confirm-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="confirm-icon">

              💾

            </div>

            <h2>

              Save Profile?

            </h2>

            <p>

              Are you sure you want to save your profile changes?

            </p>

            <span>

              Your updated information will appear across LifeOS.

            </span>

            <div className="confirm-actions">

              <button
                className="confirm-cancel"
                onClick={() =>
                  setShowSaveConfirm(false)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-save"
                onClick={handleSave}
              >
                💾 Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default ProfileModal;