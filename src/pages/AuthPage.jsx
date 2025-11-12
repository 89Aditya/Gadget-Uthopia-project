import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FormCard from '../components/FormCard'
import axios from 'axios'

export default function AuthPage() {
  const [tab, setTab] = useState('register') // 'register' | 'login'
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Smart Tab Switching based on URL
  useEffect(() => {
    const urlTab = searchParams.get('tab')
    if (urlTab === 'login' || urlTab === 'register') {
      setTab(urlTab)
    }
  }, [searchParams])

  // Login Form State
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)

  const onLogin = async (e) => {
    e.preventDefault()
    setLoginError('')

    if (!identifier.trim() || !password) {
      setLoginError('Please enter email/phone and password')
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
      setLoginError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="card" style={{ maxWidth: 600 }}>
        
        {/* Tabs */}
        <div className="card-header" style={{ paddingBottom: 0 }}>
          {/* <div className="badge">Orange & Blue</div> */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            
            <div
              onClick={() => setTab('register')}
              className={`pill-tab ${tab === 'register' ? 'active' : ''}`}
            >
              Register
            </div>
            
            <div
              onClick={() => setTab('login')}
              className={`pill-tab ${tab === 'login' ? 'active' : ''}`}
            >
              Login
            </div>

          </div>
        </div>

        <div className="card-body">
          {tab === 'register' && (
            <FormCard />
          )}

          {tab === 'login' && (
            <form onSubmit={onLogin} style={{ marginTop: 12 }}>
              <div className="field">
                <label className="label">Email or Phone</label>
                <input
                  className="input"
                  placeholder="you@example.com or 9876543210"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                />
              </div>

              <div className="field" style={{ marginTop: 12 }}>
                <label className="label">Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {loginError && <div className="error" style={{ marginTop: 10 }}>{loginError}</div>}

              <div className="actions" style={{ marginTop: 16 }}>
                <button className="btn btn-primary" disabled={loading} type="submit">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
