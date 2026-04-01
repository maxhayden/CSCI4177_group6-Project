import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import './SearchPage.css';

const GENRES = [
  { label: 'All', value: '' },
  { label: 'Action', value: '4' },
  { label: 'RPG', value: '5' },
  { label: 'Strategy', value: '10' },
  { label: 'Shooter', value: '2' },
  { label: 'Adventure', value: '3' },
  { label: 'Puzzle', value: '7' },
  { label: 'Sports', value: '15' },
  { label: 'Racing', value: '1' },
];

const ORDERINGS = [
  { label: 'Top Rated', value: '-rating' },
  { label: 'Newest', value: '-released' },
  { label: 'Most Popular', value: '-added' },
];

async function fetchSearchResults(query, token) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/games/search/${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

async function fetchBrowseResults(genres, ordering, page, token) {
  const params = new URLSearchParams({ ordering, page, page_size: 20 });
  if (genres) params.set('genres', genres);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/games/browse?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

function gameDetails(gameId) {
  window.location.href = `/game/${gameId}`;
}

export default function SearchPage() {
  const { user } = useAuth();
  const token = user?.token;
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [games, setGames] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [ordering, setOrdering] = useState('-rating');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const activeQuery = searchParams.get('q');

  // Search mode: triggered by ?q= param
  useEffect(() => {
    if (!activeQuery) return;
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchSearchResults(activeQuery, token);
        const results = data.results || [];
        setGames(results);
        setTotalCount(results.length);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [activeQuery, token]);

  // Browse mode: triggered when no search query
  useEffect(() => {
    if (activeQuery) return;
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchBrowseResults(selectedGenre, ordering, page, token);
        setGames(data.results || []);
        setTotalCount(data.count || 0);
        setHasNext(!!data.next);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [activeQuery, selectedGenre, ordering, page, token]);

  function handleSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  }

  function handleClearSearch() {
    setSearchQuery('');
    setSearchParams({});
    setPage(1);
  }

  function handleGenreSelect(value) {
    setSelectedGenre(value);
    setPage(1);
  }

  function handleOrderingChange(e) {
    setOrdering(e.target.value);
    setPage(1);
  }

  function getBrowseTitle() {
    const genre = GENRES.find(g => g.value === selectedGenre);
    const order = ORDERINGS.find(o => o.value === ordering);
    if (selectedGenre) return `${genre?.label} Games — ${order?.label}`;
    return `Browse Games — ${order?.label}`;
  }

  return (
    <div className="dashboard-container container">
      <form onSubmit={handleSubmit} className="log-form">
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by game name..."
        />
        <button type="submit" className="btn btn-primary">Search</button>
        {activeQuery && (
          <button type="button" className="btn btn-outline" onClick={handleClearSearch}>
            Clear
          </button>
        )}
      </form>

      {!activeQuery && (
        <>
          <div className="browse-controls">
            <div className="genre-tabs">
              {GENRES.map(g => (
                <button
                  key={g.value}
                  className={`genre-tab${selectedGenre === g.value ? ' active' : ''}`}
                  onClick={() => handleGenreSelect(g.value)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <select className="ordering-select" value={ordering} onChange={handleOrderingChange}>
              {ORDERINGS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="search-results-top">
        <h1 className="search-results-header">
          {activeQuery ? "Search Results" : getBrowseTitle()}
        </h1>
        {!isLoading && <div className="search-results-count">{totalCount.toLocaleString()} {activeQuery ? 'results' : 'games'}</div>}
      </div>

      {isLoading ? (
        <div className="loading-state">Loading...</div>
      ) : (
        <ul>
          {games.map(game => (
            <div className="game-card" key={game.id} onClick={() => gameDetails(game.id)}>
              <img src={game.background_image} alt={game.name} className="game-image" />
              <div className="game-details">
                <h2>{game.name}</h2>
                <p>Released: {game.released || 'N/A'}</p>
                <p>Rating: {game.rating ? `${game.rating} / 5` : 'N/A'}</p>
              </div>
            </div>
          ))}
        </ul>
      )}

      {!activeQuery && !isLoading && games.length > 0 && (
        <div className="pagination">
          {page > 1 && (
            <button className="btn btn-outline pagination-btn prev" onClick={() => setPage(p => p - 1)}>
              ← Previous
            </button>
          )}
          <span className="page-indicator">Page {page}</span>
          <button
            className="btn btn-outline pagination-btn next"
            onClick={() => setPage(p => p + 1)}
            disabled={!hasNext}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
