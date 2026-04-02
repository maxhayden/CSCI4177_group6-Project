import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './UserProfilePage.css'

export default function UserProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()
  const token = user?.token

  const [profile, setProfile] = useState(null)
  const [lists, setLists] = useState([])
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const load = async () => {
      setLoading(true)
      try {
        // Fetch the user's profile
        const profileRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!profileRes.ok) { setLoading(false); return }
        const profileData = await profileRes.json()
        setProfile(profileData)

        // If restricted, stop here
        if (profileData.restricted) { setLoading(false); return }

        // Fetch their lists
        const listsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/lists/user/${profileData._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (listsRes.ok) setLists(await listsRes.json())

        // Fetch their wishlist
        const wishlistRes = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/user/${profileData._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (wishlistRes.ok) setWishlist(await wishlistRes.json())
      } catch (err) {
        console.error('Failed to load user profile:', err)
      }
      setLoading(false)
    }

    load()
  }, [username, token])

  if (loading) return <div className="user-profile-container container"><p className="user-profile-muted">Loading...</p></div>

  if (!profile) return <div className="user-profile-container container"><p className="user-profile-muted">User not found.</p></div>

  if (profile.restricted) {
    return (
      <div className="user-profile-container container">
        <div className="user-profile-card">
          <div className="user-profile-avatar">{profile.username[0].toUpperCase()}</div>
          <h1 className="user-profile-username">{profile.username}</h1>
          <p className="user-profile-muted">This profile is private.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-profile-container container">
      <div className="user-profile-card">
        <div className="user-profile-avatar">
          {profile.avatar
            ? <img src={profile.avatar} alt={profile.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            : profile.username[0].toUpperCase()
          }
        </div>
        <h1 className="user-profile-username">{profile.username}</h1>
        {profile.bio && <p className="user-profile-bio">{profile.bio}</p>}
      </div>

      <div className="user-profile-section">
        <h2 className="user-profile-section-title">Lists</h2>
        {lists.length === 0 ? (
          <p className="user-profile-muted">No public lists.</p>
        ) : (
          <div className="user-profile-grid">
            {lists.map((list) => (
              <Link key={list._id} to={`/lists/${list._id}`} className="user-profile-list-card">
                <span className="user-profile-list-name">{list.name}</span>
                <span className="user-profile-list-count">{list.games.length} games</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="user-profile-section">
        <h2 className="user-profile-section-title">Wishlist</h2>
        {!wishlist || wishlist.games.length === 0 ? (
          <p className="user-profile-muted">No public wishlist games.</p>
        ) : (
          <div className="user-profile-grid">
            {wishlist.games.map((game) => (
              <Link key={game.gameId} to={`/game/${game.gameId}`} className="user-profile-list-card">
                {game.gameCover && (
                  <img src={game.gameCover} alt={game.gameName} className="user-profile-game-cover" />
                )}
                <span className="user-profile-list-name">{game.gameName}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
