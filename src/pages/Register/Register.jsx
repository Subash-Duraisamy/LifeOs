import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../../services/authService";
import toast from "react-hot-toast";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ===========================
      Register
  =========================== */

  async function handleRegister(e) {
    e.preventDefault();

    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    if (username.includes(" ")) {
      toast.error("Username cannot contain spaces.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");    
      
      return;
    }

    if (password !== confirmPassword) {
    toast.error("Passwords do not match."); 
      
      return;
    }

try {
  setLoading(true);

  console.log("Calling register...");

  const result = await register(
    fullName.trim(),
    username.trim().toLowerCase(),
    email.trim(),
    password
  );

  console.log("Register Success:", result);

  toast.success("🎉 Account created successfully!");

  navigate("/dashboard");

} catch (error) {

  console.error("========== REGISTER ERROR ==========");
  console.error(error);
  console.error("Code:", error.code);
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);

  toast.error(error.message || "Registration failed.");

} finally {

  setLoading(false);

}
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <h1>Create Account</h1>

          <p>Welcome to LifeOS 🚀</p>

        </div>

        <form
          className="login-form"
          onSubmit={handleRegister}
        >

          {/* Full Name */}

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={loading}
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
            />

          </div>

          {/* Username */}

          <div className="form-group">

            <label>Username</label>

            <input
              type="text"
              placeholder="@username"
              autoComplete="username"
              disabled={loading}
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

          </div>

          {/* Email */}

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          {/* Password */}

          <div className="form-group">

            <label>Password</label>

            <div className="password-input">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter password"
                autoComplete="new-password"
                disabled={loading}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "🙈" : "👁"}
              </button>

            </div>

          </div>

          {/* Confirm Password */}

          <div className="form-group">

            <label>Confirm Password</label>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm password"
              autoComplete="new-password"
              disabled={loading}
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
            />

          </div>

          {/* Submit */}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Creating your account..."
              : "Create Account"}
          </button>

        </form>

        <div className="bottom-text">

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;