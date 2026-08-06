import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../services/authService";

import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();

    if (!email.trim()) {
     toast.error("Please enter your email.");
     
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email);
      toast.error("Password reset link has been sent to your email.");

      
      setEmail("");
    } catch (error) {
        toast.error(error.message);
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <h1>Forgot Password</h1>

          <p>
            Enter your registered email to receive a password reset link.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleReset}
        >
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        <div className="bottom-text">
          Remember your password?

          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;