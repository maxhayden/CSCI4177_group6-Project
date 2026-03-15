import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './ListsPage.css'

const API = import.meta.env.VITE_API_URL

export default function ListsPage() {
  const { user } = useAuth()
  const token = user?.token
  const navigate = useNavigate()

  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Create modal state
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newPublic, setNewPublic] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  // Delete confirm state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const fetchLists = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/api/lists/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load lists')
      const data = await res.json()
      setLists(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchLists()
  }, [token])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) {
      setCreateError('Please enter a list name')
      return
    }
    setCreating(true)
    setCreateError('')
    try {
      const res = await fetch(`${API}/api/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, description: newDesc, isPublic: newPublic }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Failed to create list')
      }
      const created = await res.json()
      setLists((prev) => [created, ...prev])
      setShowModal(false)
      setNewName('')
      setNewDesc('')
      setNewPublic(false)
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/api/lists/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete list')
      setLists((prev) => prev.filter((l) => l._id !== id))
      setConfirmDeleteId(null)
    } catch (err) {
      alert(err.message)
    }
  }

  if (!user) {
    return (
      <div className="lists-page container">
        <p className="lists-auth-msg">Please <a href="/login">sign in</a> to view your lists.</p>
      </div>
    )
  }

  return (
    <div className="lists-page container">
      {/* Header */}
      <div className="lists-header">
        <div>
          <h1 className="lists-title">My Custom Lists</h1>
          <p className="lists-subtitle">{lists.length} {lists.length === 1 ? 'list' : 'lists'}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create New List
        </button>
      </div>

      {/* Loading / Error */}
      {loading && <p className="lists-status">Loading your lists…</p>}
      {error && <p className="lists-status lists-status--error">{error}</p>}

      {/* Empty state */}
      {!loading && !error && lists.length === 0 && (
        <div className="lists-empty">
          <span className="lists-empty-icon">📋</span>
          <h2>No Custom Lists Yet</h2>
          <p>Create your first list to organize your gaming collection</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Create Your First List
          </button>
        </div>
      )}

      {/* Lists Grid */}
      {!loading && lists.length > 0 && (
        <div className="lists-grid">
          {lists.map((list) => (
            <div key={list._id} className="list-card">
              {/* Cover thumbnails */}
              <div className="list-card__covers">
                {list.games.slice(0, 4).map((g, i) =>
                  g.gameCover ? (
                    <img key={i} src={g.gameCover} alt={g.gameName} className="list-card__thumb" />
                  ) : (
                    <div key={i} className="list-card__thumb list-card__thumb--placeholder">🎮</div>
                  )
                )}
                {list.games.length === 0 && (
                  <div className="list-card__thumb list-card__thumb--placeholder list-card__thumb--full">🎮</div>
                )}
              </div>

              {/* Info */}
              <div className="list-card__info">
                <div className="list-card__top">
                  <h3 className="list-card__name">{list.name}</h3>
                  <span className="list-card__privacy">
                    {list.isPublic ? '🌐' : '🔒'}
                  </span>
                </div>
                <p className="list-card__meta">
                  {list.games.length} {list.games.length === 1 ? 'game' : 'games'} ·{' '}
                  Updated {new Date(list.updatedAt).toLocaleDateString()}
                </p>
                {list.description && (
                  <p className="list-card__desc">{list.description}</p>
                )}
              </div>

              {/* Actions */}
              <div className="list-card__actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/lists/${list._id}`)}
                >
                  View Full List
                </button>
                <button
                  className="list-card__icon-btn"
                  title="Delete list"
                  onClick={() => setConfirmDeleteId(list._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Create New List</h2>
            <form onSubmit={handleCreate} className="modal__form">
              <label className="modal__label">
                List Name <span className="required">*</span>
                <input
                  className="modal__input"
                  type="text"
                  placeholder='e.g. "Games to Finish This Month"'
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={100}
                  autoFocus
                />
              </label>
              <label className="modal__label">
                Description (optional)
                <textarea
                  className="modal__input modal__textarea"
                  placeholder="What is this list for?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  maxLength={300}
                  rows={3}
                />
              </label>
              <label className="modal__label modal__label--inline">
                <input
                  type="checkbox"
                  checked={newPublic}
                  onChange={(e) => setNewPublic(e.target.checked)}
                />
                Make this list public
              </label>
              {createError && <p className="modal__error">{createError}</p>}
              <div className="modal__footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => { setShowModal(false); setCreateError('') }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating…' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDeleteId && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal modal--sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Delete List?</h2>
            <p className="modal__body">This action cannot be undone. All games in this list will be removed.</p>
            <div className="modal__footer">
              <button className="btn btn-outline" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteId)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
