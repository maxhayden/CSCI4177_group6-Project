import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FaGamepad, FaBars, FaTimes } from 'react-icons/fa'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change / outside click
  useEffect(() => {
    if (!menuOpen) return
    const close = (e) => {
      if (!e.target.closest('.navbar')) setMenuOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [menuOpen])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollToTop = (e) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
    } else {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollToFeatures = (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for the page to render then scroll
      setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <nav className="navbar__inner container" aria-label="Primary navigation">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="Game Deck — home" onClick={scrollToTop}>
          <FaGamepad className="navbar__logo-icon" aria-hidden="true" />
          <span className="navbar__logo-text">Game Deck</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="navbar__links" role="list">
          <li>
            <NavLink to="/" end className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
              Home
            </NavLink>
          </li>
          <li>
            <a href="#features" className="navbar__link" onClick={scrollToFeatures}>
              Features
            </a>
          </li>
          <li>
            <NavLink to="/faq" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
              FAQ
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Desktop CTA */}
        <div className="navbar__actions">
          <Link to="/login" className="btn btn-outline btn-sm" aria-label="Sign in to your account">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="navbar__mobile-links" role="list">
          <li>
            <NavLink to="/" end className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <a href="#features" className="navbar__mobile-link" onClick={scrollToFeatures}>
              Features
            </a>
          </li>
          <li>
            <NavLink to="/faq" className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              FAQ
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`} onClick={() => setMenuOpen(false)}>
              Contact
            </NavLink>
          </li>
        </ul>
        <div className="navbar__mobile-actions">
          <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
            Sign In
          </Link>
          <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
