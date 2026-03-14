import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GameDetails.css';

export default function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/games/${id}`)
      .then(res => res.json())
      .then(data => setGame(data))
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
    </div>
  );
}