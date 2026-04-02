import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './FriendsPage.css';

export default function FriendsPage() {
  const { user } = useAuth();
  const token = user?.token;

  const [friends, setFriends] = useState([]);

  // Load the current user's friends when the page mounts
  useEffect(() => {
    if (!token) return;

    const loadFriends = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setFriends(data);
        }
      } catch (err) {
        console.error('Could not load friends list:', err);
      }
    };

    loadFriends();
  }, [token]);

  // Remove a friend from the list
  const handleRemove = async (requestId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/friends/${requestId}/remove`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setFriends((prev) => prev.filter((f) => f.requestId !== requestId));
      }
    } catch (err) {
      console.error('Could not remove friend:', err);
    }
  };

  return (
    <div className="friends-container container">
      <div className="friends-top-bar">
        <h1>Friends</h1>
        <Link to="/friend-requests" className="btn btn-primary">
          Friend Requests
        </Link>
      </div>
      {friends.length === 0 ? (
        <div className="friends-section">
          <p className="friends-empty">You have not added any friends yet.</p>
        </div>
      ) : (
        <div className="friends-list">
          {friends.map(({ requestId, user: friend }) => (
            <div key={requestId} className="friends-section friend-row">

              <div className="friend-avatar" aria-hidden="true">
                {friend.username[0].toUpperCase()}
              </div>

              <span className="friend-username">{friend.username}</span>

              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleRemove(requestId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
