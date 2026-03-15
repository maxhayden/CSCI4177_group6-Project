import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUserCircle, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import '../LoginPage/LoginPage.css'
import './ProfilePage.css'

function validate(fields) {
  const errors = {}
  if (!fields.username.trim()) {
    errors.username = 'Username is required.'
  } else if (fields.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.'
  }
  if (fields.bio.length > 200) {
    errors.bio = 'Bio cannot exceed 200 characters.'
  }
  return errors
}

export default function ProfilePage() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const [fields, setFields] = useState({
    username: user?.username ?? '',
    bio: user?.bio ?? '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | saving | deleting
  const [successMsg, setSuccessMsg] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((f) => ({ ...f, [name]: value }))
    setSuccessMsg('')
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
    setTouched({ username: true, bio: true })
    const validationErrors = validate(fields)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('saving')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ username: fields.username, bio: fields.bio }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      login({ ...user, ...data })
      setSuccessMsg('Profile updated successfully.')
    } catch (err) {
      setErrors({ server: err.message })
    } finally {
      setStatus('idle')
    }
  }

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    setStatus('deleting')
    setDeleteError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }
      logout()
      navigate('/')
    } catch (err) {
      setDeleteError(err.message)
      setStatus('idle')
    }
  }

  const avatarInitial = user?.username?.[0]?.toUpperCase() ?? '?'

  if (!user) {
    return (
      <>
        <section className="page-header" aria-labelledby="profile-page-heading">
          <div className="page-header__bg" aria-hidden="true" />
          <div className="container page-header__inner">
            <h1 id="profile-page-heading" className="page-header__title">Profile</h1>
          </div>
        </section>
        <section className="profile-section section-sm" aria-label="Profile">
          <div className="container profile-container">
            <div className="profile-card">
              <div className="profile-unauth">
                <FaUserCircle size={48} style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
                <p>You need to be signed in to view your profile.</p>
                <Link to="/login" className="btn btn-primary">Sign In</Link>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* ── Page Header ─────────────────────────── */}
      <section className="page-header" aria-labelledby="profile-page-heading">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container page-header__inner">
          <div className="section-tag">
            <span className="badge">Your Account</span>
          </div>
          <h1 id="profile-page-heading" className="page-header__title">
            Profile
          </h1>
          <p className="page-header__sub">
            Manage your Game Deck identity and preferences.
          </p>
        </div>
      </section>

      {/* ── Profile Card ────────────────────────── */}
      <section className="profile-section section-sm" aria-label="Profile settings">
        <div className="container profile-container">
          <div className="profile-card">

            {/* Avatar + current info */}
            <div className="profile-identity">
              <div className="profile-avatar" aria-hidden="true">
                {user.avatar ? (
                  <img src={user.avatar} alt={`${user.username} avatar`} />
                ) : (
                  avatarInitial
                )}
              </div>
              <div className="profile-meta">
                <span className="profile-username">{user.username}</span>
                <span className="profile-email">{user.email}</span>
                {user.bio && (
                  <span className="profile-bio-display">{user.bio}</span>
                )}
              </div>
            </div>

            <hr className="profile-divider" />

            {/* Edit form */}
            <div>
              <p className="profile-form-title">Edit Profile</p>
              <form
                className="profile-form auth-form"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Edit profile form"
              >
                {/* Username */}
                <div className={`form-group ${errors.username && touched.username ? 'form-group--error' : ''}`}>
                  <label className="form-label" htmlFor="profile-username">
                    Username <span aria-hidden="true" className="form-required">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    type="text"
                    id="profile-username"
                    name="username"
                    className="form-input"
                    value={fields.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="username"
                    aria-required="true"
                    aria-describedby={errors.username && touched.username ? 'profile-username-error' : undefined}
                    aria-invalid={errors.username && touched.username ? 'true' : 'false'}
                    disabled={status === 'saving'}
                  />
                  {errors.username && touched.username && (
                    <p className="form-error" id="profile-username-error" role="alert">
                      <FaExclamationCircle aria-hidden="true" /> {errors.username}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className={`form-group ${errors.bio && touched.bio ? 'form-group--error' : ''}`}>
                  <label className="form-label" htmlFor="profile-bio">
                    Bio
                    <span style={{ marginLeft: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      ({fields.bio.length}/200)
                    </span>
                  </label>
                  <textarea
                    id="profile-bio"
                    name="bio"
                    className="form-input"
                    value={fields.bio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell the community about yourself…"
                    maxLength={200}
                    rows={3}
                    aria-describedby={errors.bio && touched.bio ? 'profile-bio-error' : undefined}
                    aria-invalid={errors.bio && touched.bio ? 'true' : 'false'}
                    disabled={status === 'saving'}
                    style={{ resize: 'vertical' }}
                  />
                  {errors.bio && touched.bio && (
                    <p className="form-error" id="profile-bio-error" role="alert">
                      <FaExclamationCircle aria-hidden="true" /> {errors.bio}
                    </p>
                  )}
                </div>

                {/* Server error */}
                {errors.server && (
                  <p className="form-error" role="alert">
                    <FaExclamationCircle aria-hidden="true" /> {errors.server}
                  </p>
                )}

                {/* Success */}
                {successMsg && (
                  <p className="profile-success" role="status">
                    <FaCheckCircle aria-hidden="true" /> {successMsg}
                  </p>
                )}

                <div className="profile-actions">
                  <button
                    type="submit"
                    className="btn btn-primary profile-save-btn"
                    disabled={status === 'saving'}
                    aria-busy={status === 'saving'}
                  >
                    {status === 'saving' ? (
                      <><span className="spinner" aria-hidden="true" /> Saving…</>
                    ) : (
                      'Save Changes'
                    )}
                  </button>

                  <button
                    type="button"
                    className="profile-signout-btn"
                    onClick={handleSignOut}
                    disabled={status === 'saving' || status === 'deleting'}
                  >
                    Sign Out
                  </button>

                  <button
                    type="button"
                    className="profile-delete-btn"
                    onClick={() => { setDeleteError(''); setDeleteConfirmText(''); setShowDeleteModal(true) }}
                    disabled={status === 'saving' || status === 'deleting'}
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ── Delete Confirmation Modal ────────────── */}
      {showDeleteModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="modal">
            <h2 id="delete-modal-title" className="modal__title">Delete Account?</h2>
            <p className="modal__body">
              This is permanent. All your data will be erased and cannot be recovered.
              Type <strong>confirm</strong> below to proceed.
            </p>
            <input
              className="form-input"
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="confirm"
              autoComplete="off"
              disabled={status === 'deleting'}
              aria-label="Type confirm to enable deletion"
            />
            {deleteError && (
              <p className="form-error" role="alert">
                <FaExclamationCircle aria-hidden="true" /> {deleteError}
              </p>
            )}
            <div className="modal__actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={status === 'deleting'}
              >
                Cancel
              </button>
              <button
                className="profile-delete-btn"
                onClick={handleDeleteAccount}
                disabled={status === 'deleting' || deleteConfirmText !== 'confirm'}
                aria-busy={status === 'deleting'}
              >
                {status === 'deleting' ? (
                  <><span className="spinner" aria-hidden="true" /> Deleting…</>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
