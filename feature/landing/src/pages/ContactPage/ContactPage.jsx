import { useState } from 'react'
import {
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaUsers,
  FaShieldAlt,
  FaTwitter,
  FaDiscord,
  FaGithub,
  FaListUl,
  FaStar,
  FaSearch,
} from 'react-icons/fa'
import './ContactPage.css'

const TEAM = [
  { name: 'Umar Fazeer',         role: 'Authentication & Security', icon: FaShieldAlt, branch: 'feature/auth'        },
  { name: 'Patric Manoharan',    role: 'Friends & Social Features',  icon: FaUsers,     branch: 'feature/friends'     },
  { name: 'Krishna Nanda Kumar', role: 'Game Lists & Collections',   icon: FaListUl,    branch: 'feature/lists'       },
  { name: 'Max Hayden',          role: 'Game Sessions & Tracking',   icon: FaClock,     branch: 'feature/sessions'    },
  { name: 'Shiyu Huang',         role: 'Reviews & Ratings',          icon: FaStar,      branch: 'feature/reviews'     },
  { name: 'Zijian Wang',         role: 'Game Search & Discovery',    icon: FaSearch,    branch: 'feature/game-search' },
]

const SUBJECTS = ['General Inquiry', 'Bug Report', 'Feature Request', 'Partnership', 'Other']

function validate(fields) {
  const errors = {}
  if (!fields.name.trim()) {
    errors.name = 'Name is required.'
  } else if (fields.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }
  if (!fields.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!fields.subject) {
    errors.subject = 'Please select a subject.'
  }
  if (!fields.message.trim()) {
    errors.message = 'Message is required.'
  } else if (fields.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters.'
  }
  return errors
}

export default function ContactPage() {
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

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
    const newErrors = validate(fields)
    setErrors((err) => ({ ...err, [name]: newErrors[name] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const allTouched = { name: true, email: true, subject: true, message: true }
    setTouched(allTouched)
    const validationErrors = validate(fields)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')
    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setFields({ name: '', email: '', subject: '', message: '' })
      setTouched({})
      setErrors({})
    }, 1200)
  }

  const resetForm = () => {
    setStatus('idle')
    setFields({ name: '', email: '', subject: '', message: '' })
    setTouched({})
    setErrors({})
  }

  return (
    <>
      {/* ── Page Header ─────────────────────────── */}
      <section className="page-header" aria-labelledby="contact-page-heading">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container page-header__inner">
          <div className="section-tag">
            <span className="badge">Get In Touch</span>
          </div>
          <h1 id="contact-page-heading" className="page-header__title">
            Contact Us
          </h1>
          <p className="page-header__sub">
            Have a question, a bug to report, or just want to say hello?
            We would love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Contact Form + Info ──────────────────── */}
      <section className="section contact-section" aria-label="Contact form and information">
        <div className="container contact-grid">

          {/* Form */}
          <div className="contact-form-wrap">
            <h2 className="contact-form-wrap__heading">Send Us a Message</h2>

            {status === 'success' ? (
              <div className="form-success" role="alert" aria-live="polite">
                <FaCheckCircle className="form-success__icon" aria-hidden="true" />
                <h3 className="form-success__heading">Message Sent!</h3>
                <p className="form-success__text">
                  Thank you for reaching out. We will get back to you within 48 hours.
                </p>
                <button className="btn btn-outline" onClick={resetForm}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label="Contact form"
              >
                {/* Name */}
                <div className={`form-group ${errors.name && touched.name ? 'form-group--error' : ''}`}>
                  <label className="form-label" htmlFor="contact-name">
                    Full Name <span aria-hidden="true" className="form-required">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    className="form-input"
                    value={fields.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your full name"
                    autoComplete="name"
                    aria-required="true"
                    aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                    aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                    disabled={status === 'submitting'}
                  />
                  {errors.name && touched.name && (
                    <p className="form-error" id="name-error" role="alert">
                      <FaExclamationCircle aria-hidden="true" /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className={`form-group ${errors.email && touched.email ? 'form-group--error' : ''}`}>
                  <label className="form-label" htmlFor="contact-email">
                    Email Address <span aria-hidden="true" className="form-required">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    className="form-input"
                    value={fields.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-required="true"
                    aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                    aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                    disabled={status === 'submitting'}
                  />
                  {errors.email && touched.email && (
                    <p className="form-error" id="email-error" role="alert">
                      <FaExclamationCircle aria-hidden="true" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className={`form-group ${errors.subject && touched.subject ? 'form-group--error' : ''}`}>
                  <label className="form-label" htmlFor="contact-subject">
                    Subject <span aria-hidden="true" className="form-required">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    className="form-input form-select"
                    value={fields.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-required="true"
                    aria-describedby={errors.subject && touched.subject ? 'subject-error' : undefined}
                    aria-invalid={errors.subject && touched.subject ? 'true' : 'false'}
                    disabled={status === 'submitting'}
                  >
                    <option value="">Select a subject...</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.subject && touched.subject && (
                    <p className="form-error" id="subject-error" role="alert">
                      <FaExclamationCircle aria-hidden="true" /> {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className={`form-group ${errors.message && touched.message ? 'form-group--error' : ''}`}>
                  <label className="form-label" htmlFor="contact-message">
                    Message <span aria-hidden="true" className="form-required">*</span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    className="form-input form-textarea"
                    value={fields.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Write your message here... (minimum 20 characters)"
                    rows={5}
                    aria-required="true"
                    aria-describedby={`message-hint${errors.message && touched.message ? ' message-error' : ''}`}
                    aria-invalid={errors.message && touched.message ? 'true' : 'false'}
                    disabled={status === 'submitting'}
                  />
                  <p id="message-hint" className="form-hint">
                    {fields.message.length} / 20 minimum characters
                  </p>
                  {errors.message && touched.message && (
                    <p className="form-error" id="message-error" role="alert">
                      <FaExclamationCircle aria-hidden="true" /> {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={status === 'submitting'}
                  aria-busy={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="spinner" aria-hidden="true" /> Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact info sidebar */}
          <aside className="contact-info" aria-label="Contact information">
            <div className="contact-info__card">
              <div className="contact-info__icon-wrap" aria-hidden="true">
                <FaEnvelope />
              </div>
              <h3 className="contact-info__label">Email Us</h3>
              <a href="mailto:support@gamedeck.app" className="contact-info__value">
                support@gamedeck.app
              </a>
            </div>

            <div className="contact-info__card">
              <div className="contact-info__icon-wrap" aria-hidden="true">
                <FaClock />
              </div>
              <h3 className="contact-info__label">Response Time</h3>
              <p className="contact-info__value">Within 48 hours</p>
            </div>

            <div className="contact-info__socials">
              <h3 className="contact-info__label">Find Us Online</h3>
              <div className="contact-socials-row" aria-label="Social media links">
                {[
                  { Icon: FaTwitter, label: 'Twitter', href: '#' },
                  { Icon: FaDiscord, label: 'Discord', href: '#' },
                  { Icon: FaGithub,  label: 'GitHub',  href: '#' },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="contact-social-btn"
                    aria-label={`Game Deck on ${label}`}
                    rel="noopener noreferrer"
                  >
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Team ────────────────────────────────── */}
      <section className="section team-section" aria-labelledby="team-heading">
        <div className="container">
          <div className="section-tag">
            <span className="badge">The Team</span>
          </div>
          <h2 id="team-heading" className="section-title">
            Meet the Developers
          </h2>
          <p className="section-subtitle">
            Game Deck is built by a passionate team of six developers as part of
            CSCI&nbsp;4177/5709 at Dalhousie University.
          </p>
          <div className="team-grid">
            {TEAM.map(({ name, role, icon: Icon, branch }) => (
              <article key={name} className="team-card">
                <div className="team-card__avatar" aria-hidden="true">
                  <Icon />
                </div>
                <h3 className="team-card__name">{name}</h3>
                <p className="team-card__role">{role}</p>
                <code className="team-card__branch">{branch}</code>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
