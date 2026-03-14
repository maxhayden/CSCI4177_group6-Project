import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGamepad, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import './LoginPage.css'

function validate(fields) {
  const errors = {}
  if (!fields.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!fields.password) {
    errors.password = 'Password is required.'
  } else if (fields.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }
  return errors
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [fields, setFields] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((f) => ({ ...f, [name]: value }))
    if (touched[name]) {
      const newErrors = validate({ ...fields, [name]: value })
      setErrors((err) => ({ ...err, [name]: newErrors[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((t) => ({ ...t, [name]: true }))
    setErrors((err) => ({ ...err, [name]: validate(fields)[name] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    const validationErrors = validate(fields)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fields.email, password: fields.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      login(data)
      navigate('/')
    } catch (err) {
      setErrors({ server: err.message })
    } finally {
      setStatus('idle')
    }
  }

  return (
    <>
      {/* ── Page Header ─────────────────────────── */}
      <section className="page-header" aria-labelledby="login-page-heading">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container page-header__inner">
          <div className="section-tag">
            <span className="badge">Welcome Back</span>
          </div>
          <h1 id="login-page-heading" className="page-header__title">
            Sign In
          </h1>
          <p className="page-header__sub">
            Pick up where you left off. Your game library is waiting.
          </p>
        </div>
      </section>

      {/* ── Auth Card ───────────────────────────── */}
      <section className="auth-section section-sm" aria-label="Login form">
        <div className="container auth-container">
          <div className="auth-card">
            <Link to="/" className="auth-card__logo" aria-label="Game Deck — home">
              <FaGamepad aria-hidden="true" />
              <span>Game Deck</span>
            </Link>

            <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Sign in form">

              {/* Email */}
              <div className={`form-group ${errors.email && touched.email ? 'form-group--error' : ''}`}>
                <label className="form-label" htmlFor="login-email">
                  Email Address <span aria-hidden="true" className="form-required">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  className="form-input"
                  value={fields.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={errors.email && touched.email ? 'login-email-error' : undefined}
                  aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                  disabled={status === 'submitting'}
                />
                {errors.email && touched.email && (
                  <p className="form-error" id="login-email-error" role="alert">
                    <FaExclamationCircle aria-hidden="true" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className={`form-group ${errors.password && touched.password ? 'form-group--error' : ''}`}>
                <div className="form-label-row">
                  <label className="form-label" htmlFor="login-password">
                    Password <span aria-hidden="true" className="form-required">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <Link to="/forgot-password" className="form-link">Forgot password?</Link>
                </div>
                <div className="input-password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    className="form-input"
                    value={fields.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your password"
                    autoComplete="current-password"
                    aria-required="true"
                    aria-describedby={errors.password && touched.password ? 'login-password-error' : undefined}
                    aria-invalid={errors.password && touched.password ? 'true' : 'false'}
                    disabled={status === 'submitting'}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="form-error" id="login-password-error" role="alert">
                    <FaExclamationCircle aria-hidden="true" /> {errors.password}
                  </p>
                )}
              </div>

              {errors.server && (
                <p className="form-error" role="alert">
                  <FaExclamationCircle aria-hidden="true" /> {errors.server}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={status === 'submitting'}
                aria-busy={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <><span className="spinner" aria-hidden="true" /> Signing In...</>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="auth-card__footer">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="form-link">Create one free</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
