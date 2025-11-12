import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomeLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const saved = localStorage.getItem("latestUser");
    if (!saved) {
      setError("No registered user found. Please register first.");
      return;
    }

    const user = JSON.parse(saved);
    if (user.email === email && user.password === password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/profile");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-left-inner">
          <h1 className="auth-title">Welcome to Gadget Utopia</h1>
          <p className="auth-subtitle">
            The best place to explore next-gen electronics.
          </p>
          <button
            className="btn btn-primary"
            style={{ fontSize: "18px", padding: "14px 22px" }}
            onClick={() => navigate("/register")}
          >
            Create an Account
          </button>
        </div>
        <div className="abstract-bg"></div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">Login</h2>
          <p className="auth-card-subtitle">Access your account</p>

          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="error">{error}</div>}

            <hr className="hr" />

            <div className="actions">
              <button className="btn btn-primary" type="submit">
                Login
              </button>
              <button
                className="btn btn-outline"
                type="button"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

