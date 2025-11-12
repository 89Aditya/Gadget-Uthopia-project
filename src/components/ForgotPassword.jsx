import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const generateToken = () =>
    Math.random().toString(36).substring(2) + Date.now().toString(36);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLink("");

    if (!isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const saved = localStorage.getItem("latestUser");
    if (!saved) {
      setError("No registered user found.");
      return;
    }

    const user = JSON.parse(saved);
    if (user.email !== email) {
      setError("Email not found.");
      return;
    }

    const token = generateToken();
    const tokens = JSON.parse(localStorage.getItem("resetTokens") || "{}");
    tokens[token] = { email, expires: Date.now() + 1000 * 60 * 15 };
    localStorage.setItem("resetTokens", JSON.stringify(tokens));

    const resetLink = `${window.location.origin}/reset-password/${token}`;
    setSuccess("Reset link generated (for demo only).");
    setLink(resetLink);
  };

  return (
    <div className="app">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Forgot Password</h1>
          <p className="card-subtitle">Enter your registered email</p>
        </div>

        <form className="card-body" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            {error && <div className="error">{error}</div>}
          </div>

          <hr className="hr" />
          <div className="actions">
            <button className="btn btn-primary" type="submit">
              Send Reset Link
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              Back to Login
            </button>
          </div>

          {success && <div className="success">{success}</div>}
          {link && (
            <a href={link} style={{ display: "block", marginTop: 10 }}>
              {link}
            </a>
          )}
        </form>
      </div>
    </div>
  );
}

