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
            onClick={handleSave}
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

    </div>

  );

}

export default ProfileModal;