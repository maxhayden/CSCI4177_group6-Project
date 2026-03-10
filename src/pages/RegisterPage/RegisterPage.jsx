import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGamepad, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa'
import '../LoginPage/LoginPage.css'

function getPasswordStrength(password) {
  if (!password) return null
  if (password.length < 6) return { level: 'weak', label: 'Weak', width: '33%' }
  if (password.length < 10 || !/[^a-zA-Z0-9]/.test(password)) return { level: 'fair', label: 'Fair', width: '66%' }
  return { level: 'strong', label: 'Strong', width: '100%' }
}

function validate(fields) {
  const errors = {}
  if (!fields.username.trim()) {
    errors.username = 'Username is required.'
  } else if (fields.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.'
  }
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
  if (!fields.confirm) {
    errors.confirm = 'Please confirm your password.'
  } else if (fields.password !== fields.confirm) {
    errors.confirm = 'Passwords do not match.'
  }
  return errors
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [fields, setFields] = useState({ username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting

  const strength = getPasswordStrength(fields.password)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ username: true, email: true, password: true, confirm: true })
    const validationErrors = validate(fields)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')
    // Placeholder — wire up to real API when backend is ready
    setTimeout(() => {
      setStatus('idle')
      navigate('/')
    }, 1000)
  }

  return (
    <>
      {/* ── Page Header ─────────────────────────── */}
      <section className="page-header" aria-labelledby="register-page-heading">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container page-header__inner">
          <div className="section-tag">
            <span className="badge">Join Game Deck</span>
          </div>
          <h1 id="register-page-heading" className="page-header__title">
            Create Account
          </h1>
          <p className="page-header__sub">
            Free forever. Track your games, log sessions, and connect with friends.
          </p>
        </div>
      </section>

      {/* ── Auth Card ───────────────────────────── */}
      <section className="auth-section section-sm" aria-label="Registration form">
        <div className="container auth-container">
          <div className="auth-card">
            <Link to="/" className="auth-card__logo" aria-label="Game Deck — home">
              <FaGamepad aria-hidden="true" />
              <span>Game Deck</span>
            </Link>

            <form className="auth-form" onSubmit={handleSubmit} noValidate aria-label="Create account form">

              {/* Username */}
              <div className={`form-group ${errors.username && touched.username ? 'form-group--error' : ''}`}>
                <label className="form-label" htmlFor="reg-username">
                  Username <span aria-hidden="true" className="form-required">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  type="text"
                  id="reg-username"
                  name="username"
                  className="form-input"
                  value={fields.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. carl_games"
                  autoComplete="username"
                  aria-required="true"
                  aria-describedby={errors.username && touched.username ? 'reg-username-error' : undefined}
                  aria-invalid={errors.username && touched.username ? 'true' : 'false'}
                  disabled={status === 'submitting'}
                />
                {errors.username && touched.username && (
                  <p className="form-error" id="reg-username-error" role="alert">
                    <FaExclamationCircle aria-hidden="true" /> {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className={`form-group ${errors.email && touched.email ? 'form-group--error' : ''}`}>
                <label className="form-label" htmlFor="reg-email">
                  Email Address <span aria-hidden="true" className="form-required">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  className="form-input"
                  value={fields.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={errors.email && touched.email ? 'reg-email-error' : undefined}
                  aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                  disabled={status === 'submitting'}
                />
                {errors.email && touched.email && (
                  <p className="form-error" id="reg-email-error" role="alert">
                    <FaExclamationCircle aria-hidden="true" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className={`form-group ${errors.password && touched.password ? 'form-group--error' : ''}`}>
                <label className="form-label" htmlFor="reg-password">
                  Password <span aria-hidden="true" className="form-required">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <div className="input-password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="reg-password"
                    name="password"
                    className="form-input"
                    value={fields.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    aria-required="true"
                    aria-describedby={`reg-strength-label${errors.password && touched.password ? ' reg-password-error' : ''}`}
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
                {strength && (
                  <div className="password-strength" aria-live="polite">
                    <div className="password-strength__bar">
                      <div
                        className={`password-strength__fill password-strength__fill--${strength.level}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <span id="reg-strength-label" className="password-strength__label">
                      Strength: {strength.label}
                    </span>
                  </div>
                )}
                {errors.password && touched.password && (
                  <p className="form-error" id="reg-password-error" role="alert">
                    <FaExclamationCircle aria-hidden="true" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`form-group ${errors.confirm && touched.confirm ? 'form-group--error' : ''}`}>
                <label className="form-label" htmlFor="reg-confirm">
                  Confirm Password <span aria-hidden="true" className="form-required">*</span>
                  <span className="sr-only">(required)</span>
                </label>
                <div className="input-password-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="reg-confirm"
                    name="confirm"
                    className="form-input"
                    value={fields.confirm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                    aria-required="true"
                    aria-describedby={errors.confirm && touched.confirm ? 'reg-confirm-error' : undefined}
                    aria-invalid={errors.confirm && touched.confirm ? 'true' : 'false'}
                    disabled={status === 'submitting'}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirm((v) => !v)}
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirm ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
                  </button>
                </div>
                {errors.confirm && touched.confirm && (
                  <p className="form-error" id="reg-confirm-error" role="alert">
                    <FaExclamationCircle aria-hidden="true" /> {errors.confirm}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={status === 'submitting'}
                aria-busy={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <><span className="spinner" aria-hidden="true" /> Creating Account...</>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="auth-card__footer">
              Already have an account?{' '}
              <Link to="/login" className="form-link">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
