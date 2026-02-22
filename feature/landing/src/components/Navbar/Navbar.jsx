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

  const regularLinks = [
    { to: '/', label: 'Home' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <nav className="navbar__inner container" aria-label="Primary navigation">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="Game Deck — home">
          <FaGamepad className="navbar__logo-icon" aria-hidden="true" />
          <span className="navbar__logo-text">Game Deck</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="navbar__links" role="list">
          {regularLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <a href="#features" className="navbar__link" onClick={scrollToFeatures}>
              Features
            </a>
          </li>
        </ul>

        {/* Desktop CTA */}
        <div className="navbar__actions">
          <Link to="/contact" className="btn btn-outline btn-sm" aria-label="Sign in to your account">
            Sign In
          </Link>
          <Link to="/contact" className="btn btn-primary btn-sm">
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
          {regularLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <a href="#features" className="navbar__mobile-link" onClick={scrollToFeatures}>
              Features
            </a>
          </li>
        </ul>
        <div className="navbar__mobile-actions">
          <Link to="/contact" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
            Sign In
          </Link>
          <Link to="/contact" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
