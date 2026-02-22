import { Link } from 'react-router-dom'
import {
  FaGamepad,
  FaTwitter,
  FaDiscord,
  FaGithub,
  FaReddit,
} from 'react-icons/fa'
import './Footer.css'

const footerLinks = {
  Product: [
    { label: 'Features', to: '/#features' },
    { label: 'How It Works', to: '/#how-it-works' },
    { label: 'Top Games', to: '/#top-games' },
    { label: 'Get Started', to: '/contact' },
  ],
  Support: [
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Privacy Policy', to: '/contact' },
    { label: 'Terms of Service', to: '/contact' },
  ],
}

const socialLinks = [
  { icon: FaTwitter, label: 'Follow us on Twitter', href: '#' },
  { icon: FaDiscord, label: 'Join our Discord server', href: '#' },
  { icon: FaReddit, label: 'Visit our Reddit community', href: '#' },
  { icon: FaGithub, label: 'View source on GitHub', href: '#' },
]

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__top container">
        {/* Brand column */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo" aria-label="GameTime home">
            <FaGamepad className="footer__logo-icon" aria-hidden="true" />
            <span>GameTime</span>
          </Link>
          <p className="footer__tagline">
            Track smarter. Play better. Take control of your gaming time with
            insights that actually matter.
          </p>
          <div className="footer__socials" aria-label="Social media links">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="footer__social-link"
                aria-label={label}
                rel="noopener noreferrer"
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <nav
            key={category}
            className="footer__col"
            aria-label={`${category} links`}
          >
            <h3 className="footer__col-heading">{category}</h3>
            <ul role="list">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} GameTime. Built with passion for
            gamers, by gamers.
          </p>
          <p className="footer__credit">
            CSCI&nbsp;4177/5709 &mdash; Group&nbsp;6
          </p>
        </div>
      </div>
    </footer>
  )
}
