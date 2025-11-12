import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function LoginWelcome() {
  const [identifier, setIdentifier] = useState('')
  const [password,   setPassword]   = useState('')
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // If redirected from register with a message, show it
  useEffect(() => {
    const msg = searchParams.get('msg')
    if (msg === 'exists') setError('Account already exists. Please log in.')
  }, [searchParams])

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
    <div className="auth-shell">
      {/* LEFT: welcome panel with abstract orange/blue background */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <h1 className="auth-title">Welcome to<br/>Gadget Utopia</h1>
          <p className="auth-subtitle">
            Sign in to manage your gadgets, or create a new account to get started.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/register')}>
            Create an account
          </button>
        </div>
        <div className="abstract-bg" aria-hidden="true" />
      </div>

      {/* RIGHT: login form */}
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">Login</h2>
          <p className="auth-card-subtitle">Use your email or phone with password.</p>

          <form onSubmit={onSubmit}>
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
              <Link to="/register" className="btn btn-outline" style={{textDecoration:'none'}}>
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
