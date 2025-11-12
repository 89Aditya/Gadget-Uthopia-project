import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim() || !password) {
      setError('Please enter email/phone and password.')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post('http://localhost:4000/api/login', {
        identifier: identifier.trim(),
        password
      })
      // Save token + user to LocalStorage
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('currentUser', JSON.stringify(data.user))

      navigate('/profile', { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.error || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="card" style={{maxWidth: 520}}>
        <div className="card-header">
          <div className="badge">Orange & Blue</div>
          <h1 className="card-title">Login</h1>
          <div className="card-subtitle">Use your <b>email or phone</b> and password.</div>
        </div>

        <form className="card-body" onSubmit={onSubmit}>
          <div className="field">
            <label className="label">Email or Phone</label>
            <input
              className="input"
              placeholder="you@example.com or 9876543210"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
            />
          </div>

          <div className="field" style={{marginTop: 12}}>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error" style={{marginTop: 10}}>{error}</div>}

          <div className="actions" style={{marginTop: 16}}>
            <button className="btn btn-primary" disabled={loading} type="submit">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
