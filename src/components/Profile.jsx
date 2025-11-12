import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("latestUser");
    if (data) setUser(JSON.parse(data));
    else navigate("/");
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="app">
      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-header">
          <h1 className="card-title">Welcome, {user.name}</h1>
          <p className="card-subtitle">Your profile details</p>
        </div>

        <div className="card-body">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Country:</strong> {user.country}</p>
          <p><strong>Description:</strong> {user.description}</p>
          <hr className="hr" />
          <div className="actions" style={{ justifyContent: "flex-end" }}>
            <button className="btn btn-outline" onClick={() => navigate("/")}>
              Back
            </button>
            <button className="btn btn-primary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

