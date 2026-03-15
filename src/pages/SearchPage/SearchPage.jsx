import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './SearchPage.css';

async function fetchGames(querytoSearch) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/games/search/${querytoSearch}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
}

function gameDetails(gameId) {
  window.location.href = `/game/${gameId}`;
}

export default function SearchPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);

  // Auto-search whenever the `?q=` param changes
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      fetchGames(query)
        .then(data => setSearchResults(data.results))
        .catch(err => console.error(err));
    }
  }, [searchParams]);

  function handleSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Update the URL, which triggers the useEffect above
      setSearchParams({ q: searchQuery });
    }
  }

  return (
    <div className="dashboard-container container">
      <form onSubmit={handleSubmit} className="log-form">
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Game Name"
        />
        <button type="submit" className="btn btn-primary">Search Games</button>
      </form>

      {searchResults.length > 0 && (
        <div className='search-results-top'>
          <h1 className="search-results-header">Search Results</h1>
          <div className="search-results-count">{searchResults.length} results</div>
        </div>
      )}

      <ul>
        {searchResults.map(game => (
          <div className="game-card" key={game.id} onClick={() => gameDetails(game.id)}>
            <h2>{game.name}</h2>
            <img src={game.background_image} alt={game.name} className="game-image" />
            <p>Released: {game.released}</p>
            <p>Rating: {game.rating}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}