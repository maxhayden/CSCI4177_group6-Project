import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './ListDetailPage.css'

const API = import.meta.env.VITE_API_URL

export default function ListDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const token = user?.token
  const navigate = useNavigate()

  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Game search to add
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [addingGameId, setAddingGameId] = useState(null)
  const [addMsg, setAddMsg] = useState('')

  // Edit modal
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editPublic, setEditPublic] = useState(false)
  const [editError, setEditError] = useState('')
  const [saving, setSaving] = useState(false)

  const isOwner = user && list && list.ownerId === user._id

  const fetchList = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to load list')
      }
      const data = await res.json()
      setList(data)
      setEditName(data.name)
      setEditDesc(data.description || '')
      setEditPublic(data.isPublic)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchList()
  }, [id, token])

  // Search games via RAWG
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    setSearchResults([])
    setAddMsg('')
    try {
      const res = await fetch(
        `${API}/api/games/search/${encodeURIComponent(searchQuery)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setSearchResults(data.results || [])
    } catch (err) {
      setAddMsg('Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleAddGame = async (game) => {
    setAddingGameId(game.id)
    setAddMsg('')
    try {
      const res = await fetch(`${API}/api/lists/${id}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameId: String(game.id),
          gameName: game.name,
          gameCover: game.background_image || '',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to add game')
      setList(data)
      setAddMsg(`✅ "${game.name}" added to list!`)
    } catch (err) {
      setAddMsg(`⚠️ ${err.message}`)
    } finally {
      setAddingGameId(null)
    }
  }

  const handleRemoveGame = async (gameId) => {
    try {
      const res = await fetch(`${API}/api/lists/${id}/games/${gameId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to remove game')
      const data = await res.json()
      setList(data)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEditSave = async (e) => {
    e.preventDefault()
    if (!editName.trim()) {
      setEditError('List name cannot be empty')
      return
    }
    setSaving(true)
    setEditError('')
    try {
      const res = await fetch(`${API}/api/lists/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, description: editDesc, isPublic: editPublic }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message)
      }
      const data = await res.json()
      setList(data)
      setShowEdit(false)
    } catch (err) {
      setEditError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="list-detail container"><p className="list-detail__status">Loading…</p></div>
  if (error) return <div className="list-detail container"><p className="list-detail__status list-detail__status--error">{error}</p></div>
  if (!list) return null

  return (
    <div className="list-detail container">
      {/* Back */}
      <Link to="/lists" className="list-detail__back">← Back to My Lists</Link>

      {/* List Header */}
      <div className="list-detail__header">
        <div>
          <div className="list-detail__title-row">
            <h1 className="list-detail__title">{list.name}</h1>
            <span className="list-detail__privacy">{list.isPublic ? '🌐 Public' : '🔒 Private'}</span>
          </div>
          {list.description && <p className="list-detail__desc">{list.description}</p>}
          <p className="list-detail__meta">
            By {list.ownerUsername} · {list.games.length} {list.games.length === 1 ? 'game' : 'games'} ·{' '}
            Updated {new Date(list.updatedAt).toLocaleDateString()}
          </p>
        </div>
        {isOwner && (
          <button className="btn btn-outline btn-sm" onClick={() => setShowEdit(true)}>
            ✏️ Edit List
          </button>
        )}
      </div>

      {/* Games in List */}
      {list.games.length === 0 ? (
        <div className="list-detail__empty">
          <p>No games in this list yet. Use the search below to add some!</p>
        </div>
      ) : (
        <div className="list-detail__games">
          {list.games.map((game) => (
            <div key={game.gameId} className="game-entry">
              {game.gameCover ? (
                <img src={game.gameCover} alt={game.gameName} className="game-entry__img" />
              ) : (
                <div className="game-entry__img game-entry__img--placeholder">🎮</div>
              )}
              <div className="game-entry__info">
                <h3 className="game-entry__name">{game.gameName}</h3>
              </div>
              <div className="game-entry__actions">
                <Link to={`/game/${game.gameId}`} className="btn btn-outline btn-sm">
                  View
                </Link>
                {isOwner && (
                  <button
                    className="list-card__icon-btn"
                    title="Remove from list"
                    onClick={() => handleRemoveGame(game.gameId)}
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Games Section (owner only) */}
      {isOwner && (
        <div className="list-detail__add-section">
          <h2 className="list-detail__add-title">Add Games</h2>
          <form onSubmit={handleSearch} className="list-detail__search-form">
            <input
              type="text"
              className="list-detail__search-input"
              placeholder="Search for a game…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={searching}>
              {searching ? 'Searching…' : 'Search'}
            </button>
          </form>

          {addMsg && <p className="list-detail__add-msg">{addMsg}</p>}

          {searchResults.length > 0 && (
            <div className="list-detail__results">
              {searchResults.slice(0, 10).map((game) => {
                const alreadyAdded = list.games.some((g) => g.gameId === String(game.id))
                return (
                  <div key={game.id} className="search-result">
                    {game.background_image ? (
                      <img src={game.background_image} alt={game.name} className="search-result__img" />
                    ) : (
                      <div className="search-result__img search-result__img--placeholder">🎮</div>
                    )}
                    <span className="search-result__name">{game.name}</span>
                    <button
                      className={`btn btn-sm ${alreadyAdded ? 'btn-outline' : 'btn-primary'}`}
                      disabled={alreadyAdded || addingGameId === game.id}
                      onClick={() => handleAddGame(game)}
                    >
                      {alreadyAdded ? '✓ Added' : addingGameId === game.id ? '…' : '+ Add'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div className="modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Edit List</h2>
            <form onSubmit={handleEditSave} className="modal__form">
              <label className="modal__label">
                List Name <span className="required">*</span>
                <input
                  className="modal__input"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={100}
                />
              </label>
              <label className="modal__label">
                Description
                <textarea
                  className="modal__input modal__textarea"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  maxLength={300}
                  rows={3}
                />
              </label>
              <label className="modal__label modal__label--inline">
                <input
                  type="checkbox"
                  checked={editPublic}
                  onChange={(e) => setEditPublic(e.target.checked)}
                />
                Make this list public
              </label>
              {editError && <p className="modal__error">{editError}</p>}
              <div className="modal__footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowEdit(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
