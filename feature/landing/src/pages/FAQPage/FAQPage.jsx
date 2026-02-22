import { useState, useMemo, useId } from 'react'
import { Link } from 'react-router-dom'
import {
  FaChevronDown,
  FaSearch,
  FaShieldAlt,
  FaClock,
  FaChartLine,
  FaUsers,
  FaArrowRight,
  FaTimes,
} from 'react-icons/fa'
import './FAQPage.css'

const FAQ_DATA = [
  {
    category: 'Account & Privacy',
    icon: FaShieldAlt,
    color: 'purple',
    items: [
      {
        q: 'How do I create a GameTime account?',
        a: 'Creating an account is free and takes under a minute. Click "Get Started Free" on the landing page, enter your email and a password, and you are ready to go. No credit card required.',
      },
      {
        q: 'Can I set my profile to private?',
        a: 'Yes. In your profile settings you can switch your visibility between Public and Private. When set to Private, other users cannot see your game library, wishlists, or custom lists unless you choose to share them.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Navigate to Settings → Account → Delete Account. You will be asked to confirm, and all your data will be permanently removed within 30 days in accordance with our privacy policy.',
      },
      {
        q: 'Is my personal information shared with third parties?',
        a: 'No. We do not sell or share your personal data with third parties. We only use your data to provide and improve the GameTime service. See our Privacy Policy for full details.',
      },
      {
        q: 'Can I change my username or email?',
        a: 'Yes, both can be changed at any time from your Account Settings. Email changes require verification of the new address before taking effect.',
      },
    ],
  },
  {
    category: 'Game Tracking & Sessions',
    icon: FaClock,
    color: 'cyan',
    items: [
      {
        q: 'How do I log a gaming session?',
        a: 'From your Dashboard, click on a game and select "Log Session". Enter your start time, end time, and any optional notes. Your playtime stats will update immediately.',
      },
      {
        q: 'Can I track games I have already played in the past?',
        a: 'Absolutely. You can backfill sessions with custom dates, so you can add historical playtime for games you have already completed. Your total stats will reflect all logged time.',
      },
      {
        q: 'What game statuses are available?',
        a: 'You can mark games as: Playing, Completed, On Hold, Dropped, or Plan to Play. These statuses help you organize your library and give you a clear picture of your gaming backlog.',
      },
      {
        q: 'How accurate is the session time tracking?',
        a: 'Sessions are manually logged, so accuracy depends on what you enter. We are planning an optional browser extension in a future update that can auto-detect session times for supported platforms.',
      },
      {
        q: 'Where do completion time estimates come from?',
        a: 'Completion time estimates are sourced from community data and updated regularly. They show average Main Story, Main + Extras, and 100% Completionist times to help you plan your gaming schedule.',
      },
    ],
  },
  {
    category: 'Time Management',
    icon: FaChartLine,
    color: 'purple',
    items: [
      {
        q: 'How can GameTime help me manage my gaming time better?',
        a: 'GameTime gives you a clear view of how much time you spend gaming each day, week, and month. Combined with completion time estimates, you can plan which games fit into your schedule before you even start.',
      },
      {
        q: 'Can I set time goals or limits for gaming?',
        a: 'Time goals are on our roadmap for the next major release. In the meantime, your weekly playtime chart on the Dashboard helps you visually monitor your habits.',
      },
      {
        q: 'Can I view my gaming statistics over time?',
        a: 'Yes. Your Stats page shows daily, weekly, and monthly playtime breakdowns, your most-played games, average session length, and your gaming streak.',
      },
      {
        q: 'Does GameTime work across different gaming platforms?',
        a: 'GameTime is platform-agnostic — you can log sessions for games on PC, PlayStation, Xbox, Nintendo Switch, or any other platform. Just search for the game and start logging.',
      },
    ],
  },
  {
    category: 'Social Features & Reviews',
    icon: FaUsers,
    color: 'cyan',
    items: [
      {
        q: 'How do friend requests work?',
        a: 'Search for a user by their username and click "Add Friend". They will receive a notification and can accept or decline. Once connected, you can see each other\'s public activity.',
      },
      {
        q: 'Can I write reviews for games I have not finished?',
        a: 'You can write a review for any game in your library, regardless of completion status. We encourage you to be clear in your review about how much of the game you have played.',
      },
      {
        q: 'What are Custom Game Lists?',
        a: 'Custom Lists let you group games however you like — "Must Play Co-op Games", "Perfect for Streaming", "Games Under 10 Hours", or anything else. Lists can be public or private and can be reviewed by other users.',
      },
      {
        q: 'Can other users comment on my game lists?',
        a: 'Yes. When you make a list public, other users can leave comments and ratings on it. This turns your lists into a social discovery tool for the whole community.',
      },
      {
        q: 'How does the weekly top-rated games feature work?',
        a: 'Every week, GameTime tallies reviews and ratings submitted by the community and surfaces the highest-rated games of the past 7 days. It is a great way to discover what the community is loving right now.',
      },
    ],
  },
]

/* ── Accordion item ─────────────────────────────── */
function AccordionItem({ item, isOpen, onToggle, headingId, panelId }) {
  return (
    <div className={`accordion-item ${isOpen ? 'accordion-item--open' : ''}`}>
      <h3>
        <button
          id={headingId}
          className="accordion-btn"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="accordion-btn__text">{item.q}</span>
          <FaChevronDown
            className="accordion-btn__chevron"
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className="accordion-panel"
        hidden={!isOpen}
      >
        <p className="accordion-panel__text">{item.a}</p>
      </div>
    </div>
  )
}

/* ── FAQ Category ───────────────────────────────── */
function FAQCategory({ category, openIndex, onToggle }) {
  const Icon = category.icon
  const uid = useId()

  return (
    <section
      className={`faq-category faq-category--${category.color}`}
      aria-labelledby={`cat-${uid}`}
    >
      <div className="faq-category__header">
        <div
          className={`faq-category__icon faq-category__icon--${category.color}`}
          aria-hidden="true"
        >
          <Icon />
        </div>
        <h2 id={`cat-${uid}`} className="faq-category__title">
          {category.category}
        </h2>
        <span className="faq-category__count" aria-label={`${category.items.length} questions`}>
          {category.items.length}
        </span>
      </div>

      <div className="accordion" role="list">
        {category.items.map((item, i) => {
          const headingId = `faq-q-${uid}-${i}`
          const panelId   = `faq-a-${uid}-${i}`
          return (
            <div key={i} role="listitem">
              <AccordionItem
                item={item}
                isOpen={openIndex === i}
                onToggle={() => onToggle(i)}
                headingId={headingId}
                panelId={panelId}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ── Main component ─────────────────────────────── */
export default function FAQPage() {
  const [query, setQuery] = useState('')
  const [openStates, setOpenStates] = useState({})

  const handleToggle = (catIdx, itemIdx) => {
    setOpenStates((prev) => {
      const key = `${catIdx}-${itemIdx}`
      return { ...prev, [key]: !prev[key] }
    })
  }

  const filtered = useMemo(() => {
    if (!query.trim()) return FAQ_DATA
    const q = query.toLowerCase()
    return FAQ_DATA.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0)
  }, [query])

  const totalResults = filtered.reduce((acc, cat) => acc + cat.items.length, 0)

  return (
    <>
      {/* ── Page Header ─────────────────────────── */}
      <section className="page-header" aria-labelledby="faq-page-heading">
        <div className="page-header__bg" aria-hidden="true" />
        <div className="container page-header__inner">
          <div className="section-tag">
            <span className="badge">Help Center</span>
          </div>
          <h1 id="faq-page-heading" className="page-header__title">
            Frequently Asked Questions
          </h1>
          <p className="page-header__sub">
            Everything you need to know about GameTime. Can&apos;t find an
            answer?{' '}
            <Link to="/contact">Contact our team.</Link>
          </p>
        </div>
      </section>

      {/* ── Search bar ──────────────────────────── */}
      <section className="faq-search-section section-sm" aria-label="Search frequently asked questions">
        <div className="container">
          <div className="faq-search-wrap">
            <label htmlFor="faq-search" className="sr-only">
              Search FAQ
            </label>
            <div className="faq-search">
              <FaSearch className="faq-search__icon" aria-hidden="true" />
              <input
                id="faq-search"
                type="search"
                className="faq-search__input"
                placeholder="Search questions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search frequently asked questions"
                aria-controls="faq-results"
              />
              {query && (
                <button
                  className="faq-search__clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <FaTimes aria-hidden="true" />
                </button>
              )}
            </div>
            {query && (
              <p
                className="faq-search-hint"
                aria-live="polite"
                aria-atomic="true"
              >
                {totalResults === 0
                  ? 'No results found. Try a different search term.'
                  : `Showing ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${query}"`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ Categories ───────────────────────── */}
      <section
        id="faq-results"
        className="section faq-content-section"
        aria-label="FAQ categories and answers"
      >
        <div className="container">
          {filtered.length === 0 ? (
            <div className="faq-empty" role="status">
              <p className="faq-empty__text">
                No questions match &ldquo;{query}&rdquo;. Try a different term
                or{' '}
                <Link to="/contact">contact us directly.</Link>
              </p>
            </div>
          ) : (
            <div className="faq-grid">
              {filtered.map((cat, catIdx) => (
                <FAQCategory
                  key={cat.category}
                  category={cat}
                  openIndex={
                    Object.entries(openStates).find(
                      ([k, v]) => k.startsWith(`${catIdx}-`) && v
                    )?.[0]?.split('-')[1] !== undefined
                      ? parseInt(
                          Object.entries(openStates)
                            .find(([k, v]) => k.startsWith(`${catIdx}-`) && v)?.[0]
                            ?.split('-')[1],
                          10
                        )
                      : null
                  }
                  onToggle={(itemIdx) => handleToggle(catIdx, itemIdx)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Still Have Questions CTA ─────────────── */}
      <section className="section-sm faq-cta-section" aria-labelledby="faq-cta-heading">
        <div className="container">
          <div className="faq-cta-card">
            <h2 id="faq-cta-heading" className="faq-cta-card__heading">
              Still Have Questions?
            </h2>
            <p className="faq-cta-card__text">
              Our team is happy to help. Send us a message and we will get back
              to you within 48 hours.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Contact Us <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
