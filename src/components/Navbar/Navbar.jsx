import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FaGamepad, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleSignOut = () => {
    setMenuOpen(false)
    logout()
    navigate('/')
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change / outside click
  useEffect(() => {
    if (!menuOpen) return
    const close = (e) => {
      if (!e.target.closest('.navbar')) setMenuOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [menuOpen])

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [dropdownOpen])

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false)
  }, [location.pathname])

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
    setDropdownOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
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

          {user ? (
            /* Logged-in nav: Home | Games | My Lists | Wishlist | Friends | More▼ */
            <>
              <li>
                <NavLink to="/search" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
                  Games
                </NavLink>
              </li>
              <li>
                <NavLink to="/lists" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
                  My Lists
                </NavLink>
              </li>
              <li>
                <NavLink to="/wishlist" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
                  Wishlist
                </NavLink>
              </li>
              <li>
                <NavLink to="/friends" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>
                  Friends
                </NavLink>
              </li>
              {/* More dropdown */}
              <li className="navbar__dropdown" ref={dropdownRef}>
                <button
                  className={`navbar__link navbar__dropdown-btn ${dropdownOpen ? 'navbar__link--active' : ''}`}
                  onClick={() => setDropdownOpen((o) => !o)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  More <FaChevronDown className={`navbar__dropdown-chevron ${dropdownOpen ? 'navbar__dropdown-chevron--open' : ''}`} aria-hidden="true" />
                </button>
                {dropdownOpen && (
                  <div className="navbar__dropdown-menu" role="menu">
                    <a href="#features" className="navbar__dropdown-item" onClick={scrollToFeatures} role="menuitem">
                      Features
                    </a>
                    <NavLink to="/faq" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)} role="menuitem">
                      FAQ
                    </NavLink>
                    <NavLink to="/contact" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)} role="menuitem">
                      Contact
                    </NavLink>
                    <div className="navbar__dropdown-divider" aria-hidden="true" />
                    <NavLink to="/dashboard" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)} role="menuitem">
                      GameLog
                    </NavLink>
                  </div>
                )}
              </li>
            </>
          ) : (
            /* Logged-out nav: Home | Features | FAQ | Contact */
            <>
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
            </>
          )}
        </ul>

        {/* Desktop CTA */}
        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/profile" className="navbar__avatar" aria-label="Your profile">
                {user.avatar
                  ? <img src={user.avatar} alt={user.username} />
                  : <span>{user.username?.[0]?.toUpperCase()}</span>
                }
              </Link>
              <button className="btn btn-outline btn-sm" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm" aria-label="Sign in to your account">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
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

          {user ? (
            <>
              <li>
                <NavLink to="/search" className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`} onClick={() => setMenuOpen(false)}>
                  Games
                </NavLink>
              </li>
              <li>
                <NavLink to="/lists" className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`} onClick={() => setMenuOpen(false)}>
                  My Lists
                </NavLink>
              </li>
              <li>
                <NavLink to="/wishlist" className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`} onClick={() => setMenuOpen(false)}>
                  Wishlist
                </NavLink>
              </li>
              <li>
                <NavLink to="/friends" className={({ isActive }) => `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`} onClick={() => setMenuOpen(false)}>
                  Friends
                </NavLink>
              </li>
              <li className="navbar__mobile-section-label">More</li>
              <li>
                <a href="#features" className="navbar__mobile-link navbar__mobile-link--sub" onClick={scrollToFeatures}>
                  Features
                </a>
              </li>
              <li>
                <NavLink to="/faq" className={({ isActive }) => `navbar__mobile-link navbar__mobile-link--sub ${isActive ? 'navbar__mobile-link--active' : ''}`} onClick={() => setMenuOpen(false)}>
                  FAQ
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => `navbar__mobile-link navbar__mobile-link--sub ${isActive ? 'navbar__mobile-link--active' : ''}`} onClick={() => setMenuOpen(false)}>
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => `navbar__mobile-link navbar__mobile-link--sub ${isActive ? 'navbar__mobile-link--active' : ''}`} onClick={() => setMenuOpen(false)}>
                  GameLog
                </NavLink>
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>

        <div className="navbar__mobile-actions">
          {user ? (
            <>
              <Link to="/profile" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button className="btn btn-primary" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
