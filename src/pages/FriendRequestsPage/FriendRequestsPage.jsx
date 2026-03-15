import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './FriendRequestsPage.css';

export default function FriendRequestsPage() {
  const { user } = useAuth();
  const token = user?.token;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const [incoming, setIncoming] = useState([]);

  // Load incoming friend requests when the page mounts
  useEffect(() => {
    if (!token) return;

    const loadIncoming = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/requests/incoming`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setIncoming(data);
        }
      } catch (err) {
        console.error('Could not load incoming requests:', err);
      }
    };

    loadIncoming();
  }, [token]);

  // Search for a user by username
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResult(null);
    setFeedback({ message: '', type: '' });

    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/friends/search?username=${searchQuery.trim()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();

      if (res.ok) {
        setSearchResult(data);
      } else {
        setFeedback({ message: data.message, type: 'error' });
      }
    } catch (err) {
      console.error('Search failed:', err);
      setFeedback({ message: 'Search failed. Please try again.', type: 'error' });
    }
  };

  // Send a friend request to the found user
  const handleSendRequest = async () => {
    if (!searchResult) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toUserId: searchResult._id }),
      });

      const data = await res.json();
      setFeedback({ message: data.message, type: res.ok ? 'success' : 'error' });

      if (res.ok) {
        setSearchResult(null);
        setSearchQuery('');
      }
    } catch (err) {
      console.error('Could not send request:', err);
      setFeedback({ message: 'Failed to send request. Please try again.', type: 'error' });
    }
  };

  // Accept an incoming friend request
  const handleAccept = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/request/${id}/accept`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setIncoming((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error('Could not accept request:', err);
    }
  };

  // Ignore an incoming friend request
  const handleIgnore = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/request/${id}/ignore`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setIncoming((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error('Could not ignore request:', err);
    }
  };

  return (
    <div className="requests-container container">
      <h1>Friend Requests</h1>
      <div className="requests-section">
        <h2>Add Friend</h2>

        <form className="search-row" onSubmit={handleSearch}>
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchResult(null);
              setFeedback({ message: '', type: '' });
            }}
            placeholder="Search by username"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {searchResult && (
          <div className="search-result">
            <div className="friend-avatar" aria-hidden="true">
              {searchResult.username[0].toUpperCase()}
            </div>
            <span className="confirm-text">
              Send a friend request to <strong>{searchResult.username}</strong>?
            </span>
            <div className="confirm-actions">
              <button className="btn btn-primary btn-sm" onClick={handleSendRequest}>
                Send Request
              </button>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSearchResult(null);
                  setSearchQuery('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {feedback.message && (
          <p className={`feedback-msg ${feedback.type}`}>{feedback.message}</p>
        )}
      </div>

      <div className="requests-section">
        <h2>Incoming Requests</h2>

        {incoming.length === 0 ? (
          <p className="requests-empty">No pending requests.</p>
        ) : (
          incoming.map((req) => (
            <div key={req._id} className="request-row">
              <div className="friend-avatar" aria-hidden="true">
                {req.from.username[0].toUpperCase()}
              </div>

              <span className="friend-username">{req.from.username}</span>

              <div className="request-actions">
                <button className="btn btn-primary btn-sm" onClick={() => handleAccept(req._id)}>
                  Accept
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => handleIgnore(req._id)}>
                  Ignore
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Link to="/friends" className="btn btn-outline" style={{ marginTop: '8px', display: 'inline-block' }}>
        ← Back to Friends
      </Link>
    </div>
  );
}
