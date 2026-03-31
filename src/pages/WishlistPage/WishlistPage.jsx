import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './WishlistPage.css'

const API = import.meta.env.VITE_API_URL

export default function WishlistPage() {
  const { user } = useAuth()
  const token = user?.token

  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmRemoveId, setConfirmRemoveId] = useState(null)
  const [privacyUpdating, setPrivacyUpdating] = useState(false)

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/wishlist/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load wishlist')
      const data = await res.json()
      setWishlist(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchWishlist()
  }, [token])

  const handleRemoveGame = async (gameId) => {
    try {
      const res = await fetch(`${API}/api/wishlist/games/${gameId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to remove game')
      const data = await res.json()
      setWishlist(data)
      setConfirmRemoveId(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleTogglePrivacy = async () => {
    setPrivacyUpdating(true)
    try {
      const res = await fetch(`${API}/api/wishlist/privacy`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPublic: !wishlist.isPublic }),
      })
      if (!res.ok) throw new Error('Failed to update privacy')
      const data = await res.json()
      setWishlist(data)
    } catch (err) {
      alert(err.message)
    } finally {
      setPrivacyUpdating(false)
    }
  }

  if (!user) {
    return (
      <div className="wishlist-page container">
        <p className="wishlist-auth-msg">
          Please <a href="/login">sign in</a> to view your wishlist.
        </p>
      </div>
    )
  }

  return (
    <div className="wishlist-page container">
      {/* Header */}
      <div className="wishlist-header">
        <div>
          <h1 className="wishlist-title">My Wishlist</h1>
          <p className="wishlist-subtitle">
            {wishlist ? `${wishlist.games.length} ${wishlist.games.length === 1 ? 'game' : 'games'}` : ''}
          </p>
        </div>
        {wishlist && (
          <button
            className={`btn ${wishlist.isPublic ? 'btn-outline' : 'btn-primary'} btn-sm`}
            onClick={handleTogglePrivacy}
            disabled={privacyUpdating}
          >
            {privacyUpdating ? 'Saving…' : wishlist.isPublic ? '🌐 Public — Make Private' : '🔒 Private — Make Public'}
          </button>
        )}
      </div>

      {/* Loading / Error */}
      {loading && <p className="wishlist-status">Loading your wishlist…</p>}
      {error && <p className="wishlist-status wishlist-status--error">{error}</p>}

      {/* Empty state */}
      {!loading && !error && wishlist && wishlist.games.length === 0 && (
        <div className="wishlist-empty">
          <span className="wishlist-empty-icon">⭐</span>
          <h2>Your Wishlist is Empty</h2>
          <p>Browse games and click "Add to Wishlist" to save games you want to play</p>
          <Link to="/search" className="btn btn-primary">Browse Games</Link>
        </div>
      )}

      {/* Games list */}
      {!loading && wishlist && wishlist.games.length > 0 && (
        <div className="wishlist-games">
          {wishlist.games.map((game) => (
            <div key={game.gameId} className="wishlist-entry">
              {game.gameCover ? (
                <img src={game.gameCover} alt={game.gameName} className="wishlist-entry__img" />
              ) : (
                <div className="wishlist-entry__img wishlist-entry__img--placeholder">🎮</div>
              )}
              <span className="wishlist-entry__name">{game.gameName}</span>
              <div className="wishlist-entry__actions">
                <Link to={`/game/${game.gameId}`} className="btn btn-outline btn-sm">
                  View
                </Link>
                <button
                  className="wishlist-entry__remove"
                  title="Remove from wishlist"
                  onClick={() => setConfirmRemoveId(game.gameId)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remove Confirm Modal */}
      {confirmRemoveId && (
        <div className="modal-overlay" onClick={() => setConfirmRemoveId(null)}>
          <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Remove Game?</h2>
            <p className="modal__body">Remove this game from your wishlist?</p>
            <div className="modal__footer">
              <button className="btn btn-outline" onClick={() => setConfirmRemoveId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleRemoveGame(confirmRemoveId)}>
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
