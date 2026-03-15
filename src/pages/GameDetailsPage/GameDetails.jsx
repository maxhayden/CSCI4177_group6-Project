import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewSection from '../../components/ReviewSection/ReviewSection';
import './GameDetails.css';

const API = import.meta.env.VITE_API_URL;

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/games/${id}`)
      .then(res => res.json())
      .then(data => setGame(data))
      .catch(err => console.error(err));

    fetch(`${API}/api/games/${id}/recommendations`)
      .then(res => res.json())
      .then(data => setRecommendations(data.results || []))
      .catch(err => console.error(err));
  }, [id]);

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

      <button className="btn btn-primary list-button">Add To List</button>

      {game.description_raw && (
        <div className="game-details-section">
          <h2>About</h2>
          <p>{game.description_raw}</p>
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
