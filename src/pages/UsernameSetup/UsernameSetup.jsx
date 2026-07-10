import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createGoogleUser,
  usernameExists,
} from "../../services/authService";

import "./UsernameSetup.css";

function UsernameSetup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleContinue(e) {
    e.preventDefault();

    const cleanUsername = username
      .trim()
      .toLowerCase();

    if (!cleanUsername) {
      alert("Please enter a username.");
      return;
    }

    if (cleanUsername.length < 4) {
      alert("Username must be at least 4 characters.");
      return;
    }

    if (cleanUsername.includes(" ")) {
      alert("Username cannot contain spaces.");
      return;
    }

    try {
      setLoading(true);

      const exists = await usernameExists(cleanUsername);

      if (exists) {
        alert("Username already exists.");
        return;
      }

      await createGoogleUser(cleanUsername);

      alert("🎉 Welcome to LifeOS!");

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>Welcome 👋</h1>

          <p>
            Choose a unique username to continue.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleContinue}
        >

          <div className="form-group">

            <label>Username</label>

            <input
              type="text"
              placeholder="@username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Profile..."
              : "Continue"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default UsernameSetup;