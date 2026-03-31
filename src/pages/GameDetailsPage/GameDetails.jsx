import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewSection from '../../components/ReviewSection/ReviewSection';
import { useAuth } from '../../context/AuthContext';
import './GameDetails.css';

const API = import.meta.env.VITE_API_URL;

export default function GameDetails() {

  const { user } = useAuth();
  const token = user?.token;

  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const [showListModal, setShowListModal] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [addingToListId, setAddingToListId] = useState(null);
  const [listMsg, setListMsg] = useState('');

  const [wishlistMsg, setWishlistMsg] = useState('');
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/games/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setGame(data))
      .catch(err => console.error(err));

    fetch(`${API}/api/games/${id}/recommendations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setRecommendations(data.results || []))
      .catch(err => console.error(err));
  }, [id]);

  const handleOpenListModal = async () => {
    setListMsg('');
    setShowListModal(true);
    if (userLists.length === 0) {
      try {
        const res = await fetch(`${API}/api/lists/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUserLists(data);
      } catch {
        setListMsg('Could not load your lists.');
      }
    }
  };

  const handleAddToList = async (listId, listName) => {
    setAddingToListId(listId);
    setListMsg('');
    try {
      const res = await fetch(`${API}/api/lists/${listId}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          gameId: String(game.id),
          gameName: game.name,
          gameCover: game.background_image || ''
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add game');
      setListMsg(`✅ Added to "${listName}"!`);
    } catch (err) {
      setListMsg(`⚠️ ${err.message}`);
    } finally {
      setAddingToListId(null);
    }
  };

  const handleAddToWishlist = async () => {
    setAddingToWishlist(true);
    setWishlistMsg('');
    try {
      const res = await fetch(`${API}/api/wishlist/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          gameId: String(game.id),
          gameName: game.name,
          gameCover: game.background_image || ''
        })
      });
      const data = await res.json();
      if (res.status === 409) {
        setWishlistMsg('Already in your wishlist');
      } else if (!res.ok) {
        throw new Error(data.message || 'Failed to add to wishlist');
      } else {
        setWishlistMsg('Added to Wishlist!');
      }
    } catch (err) {
      setWishlistMsg(err.message);
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (!game) return <p className="loading">Loading...</p>;

  return (
    <div className="dashboard-container container">
      <div className="game-details-hero">
        <img className="game-details-image" src={game.background_image} alt={game.name} />
        <div className="game-details-header">
          <h1>{game.name}</h1>
          <div className="game-details-meta">
            <span className="meta-tag">📅 {game.released}</span>
            <span className="meta-tag">⭐ {game.rating} / 5</span>
            <span className="meta-tag">🎮 {game.playtime}h avg playtime</span>
            <span className="meta-tag">🏆 Metacritic: {game.metacritic ?? 'N/A'}</span>
          </div>
          <div className="game-details-genres">
            {game.genres?.map(g => (
              <span key={g.id} className="genre-badge">{g.name}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', margin: '1rem 0' }}>
        <button className="btn btn-primary list-button" onClick={handleOpenListModal}>
          Add To List
        </button>
        <button
          className="btn btn-outline list-button"
          onClick={handleAddToWishlist}
          disabled={addingToWishlist}
        >
          {addingToWishlist ? 'Adding…' : '⭐ Add to Wishlist'}
        </button>
        {wishlistMsg && (
          <span style={{ fontSize: '0.875rem', color: wishlistMsg.includes('Already') ? '#f59e0b' : '#22c55e' }}>
            {wishlistMsg}
          </span>
        )}
      </div>

      {showListModal && (
        <div className="modal-overlay" onClick={() => setShowListModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal__title">Add to a List</h2>
            {listMsg && <p style={{ marginBottom: '1rem' }}>{listMsg}</p>}
            {userLists.length === 0 && !listMsg ? (
              <p>Loading your lists…</p>
            ) : userLists.length === 0 && listMsg ? null : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {userLists.map(list => (
                  <li key={list._id} style={{ marginBottom: '0.5rem' }}>
                    <button
                      className="btn btn-outline"
                      style={{ width: '100%', textAlign: 'left' }}
                      disabled={addingToListId === list._id}
                      onClick={() => handleAddToList(list._id, list.name)}
                    >
                      {addingToListId === list._id ? 'Adding…' : list.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="modal__footer" style={{ marginTop: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setShowListModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {game.description_raw && (
        <div className="game-details-section">
          <h2>About</h2>
          <p>{game.description_raw}</p>
          {game.playtime && (
            <div className="pt-bar-wrap">
              <div className="pt-top">
                <h3>avg playtime</h3>
                <span><span className="pt-num">{game.playtime}</span><span className="pt-unit">hrs</span></span>
              </div>
              <div className="pt-track">
                <div className="pt-fill" style={{ width: `${Math.min((game.playtime / 100) * 100, 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      )}



      <div className="game-details-grid">
        <div className="game-details-section">
          <h2>Platforms</h2>
          <ul>
            {game.platforms?.map(({ platform }) => (
              <li key={platform.id}>{platform.name}</li>
            ))}
          </ul>
        </div>

        <div className="game-details-section">
          <h2>Developers</h2>
          <ul>
            {game.developers?.map(d => (
              <li key={d.id}>{d.name}</li>
            ))}
          </ul>
        </div>

        <div className="game-details-section">
          <h2>Publishers</h2>
          <ul>
            {game.publishers?.map(p => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection gameId={String(id)} gameName={game.name} />

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="game-details-section recommendations-section">
          <h2>Similar Games You Might Like</h2>
          <div className="recommendations-grid">
            {recommendations.map(rec => (
              <Link key={rec.id} to={`/game/${rec.id}`} className="rec-card">
                {rec.background_image && (
                  <img src={rec.background_image} alt={rec.name} className="rec-image" />
                )}
                <div className="rec-info">
                  <span className="rec-name">{rec.name}</span>
                  {rec.rating > 0 && (
                    <span className="rec-rating">★ {rec.rating.toFixed(1)}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
