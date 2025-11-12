import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const u = localStorage.getItem('currentUser')
    if (u) setUser(JSON.parse(u))
  }, [])

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
    navigate('/login', { replace: true })
  }

  return (
    <div className="app">
      <div className="card" style={{maxWidth: 720}}>
        <div className="card-header">
          <div className="badge">Orange & Blue</div>
          <h1 className="card-title">Profile</h1>
          <div className="card-subtitle">Welcome back!</div>
        </div>

        <div className="card-body">
          {user ? (
            <>
              <p><b>Name:</b> {user.name}</p>
              <p><b>Email:</b> {user.email}</p>
              <p><b>Country:</b> {user.country}</p>
              <p><b>Joined:</b> {new Date(user.createdAt).toLocaleString()}</p>
            </>
          ) : (
            <p>No user loaded.</p>
          )}

          <div className="actions" style={{marginTop: 16}}>
            <button className="btn btn-outline" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}
