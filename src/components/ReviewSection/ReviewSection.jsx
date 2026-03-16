import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import './ReviewSection.css'

const API = import.meta.env.VITE_API_URL

function StarRating({ value, onChange, readonly }) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value
  return (
    <div className="star-rating" aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`star ${star <= display ? 'filled' : ''}`}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          disabled={readonly}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ gameId, gameName }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [myReview, setMyReview] = useState(null)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [gameId])

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/reviews/game/${gameId}`)
      const data = await res.json()
      setReviews(data)
      if (user) {
        const mine = data.find(r => r.userId === user._id)
        setMyReview(mine || null)
      }
    } catch {
      setError('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (rating === 0) {
      setError('Please select a star rating')
      return
    }
    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters')
      return
    }

    const token = JSON.parse(localStorage.getItem('gamedeck_user'))?.token
    try {
      const res = await fetch(`${API}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ gameId, gameName, rating, reviewText: reviewText.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message)
        return
      }
      setReviewText('')
      setRating(5)
      fetchReviews()
    } catch {
      setError('Failed to submit review')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters')
      return
    }

    const token = JSON.parse(localStorage.getItem('gamedeck_user'))?.token
    try {
      const res = await fetch(`${API}/api/reviews/${myReview._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, reviewText: reviewText.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.message)
        return
      }
      setEditing(false)
      setReviewText('')
      fetchReviews()
    } catch {
      setError('Failed to update review')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete your review?')) return
    const token = JSON.parse(localStorage.getItem('gamedeck_user'))?.token
    try {
      await fetch(`${API}/api/reviews/${myReview._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setMyReview(null)
      setEditing(false)
      fetchReviews()
    } catch {
      setError('Failed to delete review')
    }
  }

  const startEdit = () => {
    setRating(myReview.rating)
    setReviewText(myReview.reviewText)
    setEditing(true)
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="review-section">
      <h2>
        Reviews
        {avgRating && (
          <span className="avg-rating">
            ★ {avgRating} <span className="review-count">({reviews.length})</span>
          </span>
        )}
      </h2>

      {/* Write / Edit form */}
      {user && !myReview && (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Write a Review</h3>
          <StarRating value={rating} onChange={setRating} />
          <textarea
            className="review-textarea"
            placeholder="Share your thoughts about this game… (min 10 characters)"
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            maxLength={1000}
            rows={4}
          />
          <div className="review-form-footer">
            <span className="char-count">{reviewText.length} / 1000</span>
            <button type="submit" className="btn btn-primary">Submit Review</button>
          </div>
          {error && <p className="review-error">{error}</p>}
        </form>
      )}

      {user && myReview && !editing && (
        <div className="my-review-banner">
          <span>You reviewed this game</span>
          <div>
            <button className="btn-text" onClick={startEdit}>Edit</button>
            <button className="btn-text btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}

      {user && myReview && editing && (
        <form className="review-form" onSubmit={handleUpdate}>
          <h3>Edit Your Review</h3>
          <StarRating value={rating} onChange={setRating} />
          <textarea
            className="review-textarea"
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            maxLength={1000}
            rows={4}
          />
          <div className="review-form-footer">
            <span className="char-count">{reviewText.length} / 1000</span>
            <div>
              <button type="button" className="btn-text" onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </div>
          {error && <p className="review-error">{error}</p>}
        </form>
      )}

      {!user && (
        <p className="review-login-prompt">
          <a href="/login">Log in</a> to write a review.
        </p>
      )}

      {/* Reviews list */}
      {loading ? (
        <p className="review-loading">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="review-empty">No reviews yet. Be the first!</p>
      ) : (
        <ul className="review-list">
          {reviews.map(r => (
            <li key={r._id} className={`review-card ${user && r.userId === user._id ? 'own-review' : ''}`}>
              <div className="review-card-header">
                <span className="reviewer-name">{r.username}</span>
                <StarRating value={r.rating} readonly />
                <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="review-text">{r.reviewText}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
