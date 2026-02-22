import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaClock,
  FaGamepad,
  FaHeart,
  FaList,
  FaStar,
  FaUsers,
  FaArrowRight,
  FaChevronRight,
  FaFire,
  FaTrophy,
  FaChartLine,
  FaSearch,
} from 'react-icons/fa'
import './LandingPage.css'

/* ── Simulated data ─────────────────────────────── */
const FEATURES = [
  {
    icon: FaClock,
    title: 'Session Time Tracking',
    desc: 'Log every gaming session and watch your playtime stats build up. Understand exactly where your hours go.',
    color: 'purple',
  },
  {
    icon: FaGamepad,
    title: 'Game Dashboard',
    desc: 'Your personal hub for all games — currently playing, completed, and on hold — all in one sleek view.',
    color: 'cyan',
  },
  {
    icon: FaHeart,
    title: 'Wishlist & Future Games',
    desc: 'Save games you want to play next and plan your gaming schedule before you even start.',
    color: 'purple',
  },
  {
    icon: FaList,
    title: 'Custom Game Lists',
    desc: 'Create themed lists like "Co-op Nights" or "Games to Stream" and share them with friends.',
    color: 'cyan',
  },
  {
    icon: FaStar,
    title: 'Reviews & Ratings',
    desc: 'Write detailed reviews, rate your experiences, and discover community thoughts on any game.',
    color: 'purple',
  },
  {
    icon: FaUsers,
    title: 'Friend Network',
    desc: 'Connect with gaming friends, see what they\'re playing, and share your top game lists.',
    color: 'cyan',
  },
]

const STEPS = [
  {
    step: '01',
    title: 'Create Your Account',
    desc: 'Sign up for free and set up your gamer profile in under a minute.',
  },
  {
    step: '02',
    title: 'Add Your Games',
    desc: 'Search our library and add every game you\'ve played, are playing, or want to play.',
  },
  {
    step: '03',
    title: 'Track & Reflect',
    desc: 'Log sessions, see your stats, read estimated completion times, and make every hour count.',
  },
]

const TOP_GAMES = [
  { title: 'Elden Ring', genre: 'Action RPG', rating: 9.4, hours: '70–100h', img: null },
  { title: 'Baldur\'s Gate 3', genre: 'RPG', rating: 9.7, hours: '75–150h', img: null },
  { title: 'Hollow Knight', genre: 'Metroidvania', rating: 9.1, hours: '25–45h', img: null },
  { title: 'Celeste', genre: 'Platformer', rating: 9.3, hours: '8–12h', img: null },
  { title: 'Hades', genre: 'Roguelike', rating: 9.5, hours: '20–90h', img: null },
  { title: 'Disco Elysium', genre: 'RPG', rating: 9.2, hours: '20–35h', img: null },
]

const STATS = [
  { value: 50000, suffix: '+', label: 'Games Tracked', icon: FaGamepad },
  { value: 2000000, suffix: '+', label: 'Hours Logged', icon: FaClock },
  { value: 10000, suffix: '+', label: 'Active Gamers', icon: FaUsers },
  { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: FaStar },
]

/* ── Count-up hook ──────────────────────────────── */
function useCountUp(target, duration = 2000, started = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, started])

  return count
}

/* ── Stat item ──────────────────────────────────── */
function StatItem({ value, suffix, label, icon: Icon, started }) {
  const count = useCountUp(value, 1800, started)
  const display =
    value >= 1000000
      ? `${(count / 1000000).toFixed(1)}M`
      : value >= 1000
      ? `${Math.floor(count / 1000)}K`
      : count

  return (
    <div className="stat-item" role="figure" aria-label={`${value.toLocaleString()}${suffix} ${label}`}>
      <div className="stat-icon" aria-hidden="true">
        <Icon />
      </div>
      <div className="stat-value" aria-hidden="true">
        {display}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

/* ── Main component ─────────────────────────────── */
export default function LandingPage() {
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* ── Hero ─────────────────────────────────── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero__bg-orb hero__bg-orb--1" aria-hidden="true" />
        <div className="hero__bg-orb hero__bg-orb--2" aria-hidden="true" />

        <div className="container hero__inner">
          <div className="hero__content">
            <div className="section-tag">
              <span className="badge">
                <FaFire aria-hidden="true" /> New: Top Games of the Week
              </span>
            </div>

            <h1 id="hero-heading" className="hero__heading">
              Play More.<br />
              <span className="hero__heading-accent">Track Smarter.</span>
            </h1>

            <p className="hero__subtext">
              GameTime helps gamers take control of their time. Track sessions,
              manage your library, discover new games, and connect with
              friends — all in one place.
            </p>

            <div className="hero__actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Get Started Free <FaArrowRight aria-hidden="true" />
              </Link>
              <a href="#features" className="btn btn-outline btn-lg">
                See Features <FaChevronRight aria-hidden="true" />
              </a>
            </div>

            <p className="hero__fine-print">
              Free to use &bull; No credit card required
            </p>
          </div>

          {/* Dashboard visual */}
          <div className="hero__visual" aria-hidden="true">
            <div className="dashboard-mock">
              <div className="dashboard-mock__bar">
                <span className="dashboard-mock__dot" />
                <span className="dashboard-mock__dot" />
                <span className="dashboard-mock__dot" />
                <span className="dashboard-mock__title">GameTime Dashboard</span>
              </div>
              <div className="dashboard-mock__body">
                <div className="dashboard-mock__stat-row">
                  <div className="dashboard-mock__mini-stat">
                    <FaClock className="mini-icon cyan" />
                    <span className="mini-val">142h</span>
                    <span className="mini-lbl">This month</span>
                  </div>
                  <div className="dashboard-mock__mini-stat">
                    <FaGamepad className="mini-icon purple" />
                    <span className="mini-val">24</span>
                    <span className="mini-lbl">Games</span>
                  </div>
                  <div className="dashboard-mock__mini-stat">
                    <FaTrophy className="mini-icon gold" />
                    <span className="mini-val">8</span>
                    <span className="mini-lbl">Completed</span>
                  </div>
                </div>
                <div className="dashboard-mock__chart">
                  <div className="chart-label">Weekly Playtime</div>
                  <div className="chart-bars">
                    {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="chart-bar-wrap">
                        <div
                          className="chart-bar"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="chart-days">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <span key={i}>{d}</span>
                    ))}
                  </div>
                </div>
                <div className="dashboard-mock__game-list">
                  {[
                    { name: 'Elden Ring', progress: 72, time: '68h' },
                    { name: 'Hades', progress: 45, time: '32h' },
                    { name: 'Celeste', progress: 91, time: '11h' },
                  ].map((g) => (
                    <div key={g.name} className="game-row">
                      <div className="game-row__info">
                        <span className="game-row__name">{g.name}</span>
                        <span className="game-row__time">{g.time}</span>
                      </div>
                      <div className="game-row__bar-bg">
                        <div
                          className="game-row__bar-fill"
                          style={{ width: `${g.progress}%` }}
                          role="progressbar"
                          aria-valuenow={g.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${g.name} progress: ${g.progress}%`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────── */}
      <section
        className="stats-section section-sm"
        ref={statsRef}
        aria-label="Platform statistics"
      >
        <div className="container stats-grid">
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} started={statsVisible} />
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section id="features" className="section features-section" aria-labelledby="features-heading">
        <div className="container">
          <div className="section-tag">
            <span className="badge">Everything You Need</span>
          </div>
          <h2 id="features-heading" className="section-title">
            Built for Gamers, by Gamers
          </h2>
          <p className="section-subtitle">
            Whether you are a casual weekend player or a dedicated content
            creator, GameTime gives you the tools to level up your gaming habits.
          </p>
          <div className="features-grid">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.title} className={`feature-card feature-card--${feature.color}`}>
                  <div className={`feature-card__icon feature-card__icon--${feature.color}`} aria-hidden="true">
                    <Icon />
                  </div>
                  <h3 className="feature-card__title">{feature.title}</h3>
                  <p className="feature-card__desc">{feature.desc}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section id="how-it-works" className="section hiw-section" aria-labelledby="hiw-heading">
        <div className="container">
          <div className="section-tag">
            <span className="badge">Simple Setup</span>
          </div>
          <h2 id="hiw-heading" className="section-title">
            Up and Running in Minutes
          </h2>
          <p className="section-subtitle">
            Three simple steps is all it takes to start understanding your
            gaming habits.
          </p>
          <ol className="hiw-steps" aria-label="How it works steps">
            {STEPS.map((s, i) => (
              <li key={s.step} className="hiw-step">
                <div className="hiw-step__number" aria-hidden="true">
                  {s.step}
                </div>
                <div className="hiw-step__content">
                  <h3 className="hiw-step__title">{s.title}</h3>
                  <p className="hiw-step__desc">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hiw-step__connector" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Top Games ────────────────────────────── */}
      <section id="top-games" className="section top-games-section" aria-labelledby="topgames-heading">
        <div className="container">
          <div className="section-tag">
            <span className="badge">
              <FaFire aria-hidden="true" /> Community Picks
            </span>
          </div>
          <h2 id="topgames-heading" className="section-title">
            Top Rated This Week
          </h2>
          <p className="section-subtitle">
            Discover what the GameTime community is loving right now.
          </p>
        </div>
        <div className="top-games-scroll" role="list" aria-label="Top rated games this week">
          <div className="top-games-track">
            {TOP_GAMES.map((game, i) => (
              <article key={game.title} className="game-card" role="listitem">
                <div className="game-card__rank" aria-label={`Rank ${i + 1}`}>
                  #{i + 1}
                </div>
                <div className="game-card__cover" aria-hidden="true">
                  <div className="game-card__cover-placeholder">
                    <FaGamepad />
                  </div>
                </div>
                <div className="game-card__info">
                  <h3 className="game-card__title">{game.title}</h3>
                  <p className="game-card__genre">{game.genre}</p>
                  <div className="game-card__meta">
                    <span className="game-card__rating" aria-label={`Rating: ${game.rating} out of 10`}>
                      <FaStar aria-hidden="true" /> {game.rating}
                    </span>
                    <span className="game-card__hours" aria-label={`Completion time: ${game.hours}`}>
                      <FaClock aria-hidden="true" /> {game.hours}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Completion Time Callout ───────────────── */}
      <section className="section completion-section" aria-labelledby="completion-heading">
        <div className="container">
          <div className="completion-card">
            <div className="completion-card__content">
              <div className="section-tag" style={{ justifyContent: 'flex-start' }}>
                <span className="badge">
                  <FaChartLine aria-hidden="true" /> Smart Planning
                </span>
              </div>
              <h2 id="completion-heading" className="completion-card__title">
                Know Before You Play
              </h2>
              <p className="completion-card__desc">
                Instantly see how long a game takes to beat, broken down by
                story, completionist, and average playtime. Plan your schedule
                around real data, not guesswork.
              </p>
              <div className="completion-times">
                <div className="completion-time-item">
                  <span className="completion-time-item__label">Main Story</span>
                  <span className="completion-time-item__value">25h</span>
                </div>
                <div className="completion-time-item completion-time-item--highlight">
                  <span className="completion-time-item__label">Average</span>
                  <span className="completion-time-item__value">42h</span>
                </div>
                <div className="completion-time-item">
                  <span className="completion-time-item__label">100%</span>
                  <span className="completion-time-item__value">80h</span>
                </div>
              </div>
            </div>
            <div className="completion-card__search" aria-label="Game search preview">
              <div className="search-preview">
                <div className="search-preview__input">
                  <FaSearch aria-hidden="true" className="search-preview__icon" />
                  <span>Search any game...</span>
                </div>
                <div className="search-preview__results">
                  {['Elden Ring', 'Baldur\'s Gate 3', 'Hades'].map((g) => (
                    <div key={g} className="search-preview__result">
                      <FaGamepad aria-hidden="true" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────── */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="cta-section__bg" aria-hidden="true" />
        <div className="container cta-section__inner">
          <h2 id="cta-heading" className="cta-section__heading">
            Ready to Take Control of Your Gaming Time?
          </h2>
          <p className="cta-section__sub">
            Join thousands of gamers who already use GameTime to play smarter.
            It is free, always.
          </p>
          <div className="cta-section__actions">
            <Link to="/contact" className="btn btn-primary btn-lg">
              Start Tracking Free <FaArrowRight aria-hidden="true" />
            </Link>
            <Link to="/faq" className="btn btn-outline btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
