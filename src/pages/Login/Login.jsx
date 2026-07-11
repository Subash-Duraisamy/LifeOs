import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  login,
  googleLogin,
} from "../../services/authService";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  /* ===========================
      Email Login
  =========================== */

  async function handleLogin(e) {
    e.preventDefault();

    if (!email.trim()) {
        toast.error("Please enter your email.");
      
      return;
    }

    if (!password.trim()) {
    toast.error("Please enter your password.");
      
      return;
    }

    try {
      setLoading(true);

      await login(
        email.trim(),
        password
      );

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      switch (error.code) {
        case "auth/invalid-email":
          toast.error("Invalid email");
          break;

        case "auth/user-not-found":
          toast.error("No account found");
          break;

        case "auth/wrong-password":
            toast.error("Incorrect password.");
          
          break;

        case "auth/invalid-credential":
          toast.error("Invalid email or password.");
          
          break;

        case "auth/too-many-requests":
          toast.error("Too many attempts. Try again later.");
          break;

        default:
          toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  /* ===========================
      Google Login
  =========================== */

async function handleGoogleLogin() {
  try {
    setLoading(true);

    
console.log("Attempting Google login...");
await googleLogin();
console.log("Google login successful.");


  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <h1>LifeOS</h1>

          <p>
            Welcome back 👋
          </p>

        </div>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* Email */}

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
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
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁"}
              </button>

            </div>

          </div>

          {/* Remember + Forgot */}

          <div className="login-options">

            <label className="remember-me">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
              />

              Remember Me

            </label>

            <Link
              to="/forgot-password"
              className="forgot-link"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login */}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* Divider */}

        <div className="divider">
          <span>OR</span>
        </div>

        {/* Google */}

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : "Continue with Google"}
        </button>

        {/* Bottom */}

        <div className="bottom-text">

          Don't have an account?

          <Link to="/register">
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;