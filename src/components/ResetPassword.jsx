import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const strongPassword = (v) =>
  v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem("resetTokens") || "{}");
    const entry = tokens[token];
    if (entry && Date.now() < entry.expires) {
      setValid(true);
      setEmail(entry.email);
    }
  }, [token]);

  const handleReset = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!strongPassword(password)) {
      setError("Weak password. Use upper, lower, and number.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("latestUser"));
    if (user.email !== email) {
      setError("Token invalid for this user.");
      return;
    }

    user.password = password;
    localStorage.setItem("latestUser", JSON.stringify(user));

    const tokens = JSON.parse(localStorage.getItem("resetTokens") || "{}");
    delete tokens[token];
    localStorage.setItem("resetTokens", JSON.stringify(tokens));

    setMessage("Password reset successfully! Redirecting...");
    setTimeout(() => navigate("/"), 2000);
  };

  if (!valid) {
    return (
      <div className="app">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Invalid or Expired Link</h1>
          </div>
          <div className="card-body">
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Reset Password</h1>
          <p className="card-subtitle">For {email}</p>
        </div>

        <form className="card-body" onSubmit={handleReset}>
          <div className="field">
            <label className="label">New Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label">Confirm Password</label>
            <input
              className="input"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}
          <hr className="hr" />
          <div className="actions">
            <button className="btn btn-primary" type="submit">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
