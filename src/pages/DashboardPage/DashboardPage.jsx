import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  // Get token from user
  const token = user?.token;
  const [stats, setStats] = useState([]);
  const [gameName, setGameName] = useState('');
  const [duration, setDuration] = useState('');

  const fetchStats = async () => {
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/sessions/stats', {
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setStats(data);
        }
      } else {
        console.error("refused", res.status);
      }
    } catch (err) {
      console.error("failed", err);
    }
  };

  useEffect(() => { 
    if (token) fetchStats(); 
  }, [token]);

  const handleLog = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("session over time");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/sessions/log', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ gameName, duration: parseInt(duration) })
      });

      if (!res.ok) {
        throw new Error(`request failed: ${res.status}`);
      }

      setGameName(''); 
      setDuration('');
      fetchStats(); 
    } catch (err) {
      console.error("log failed:", err.message);
      alert("log in again fail to save");
    }
  };

  return (
    <div className="dashboard-container container">
      <h1>Welcome, {user?.username || 'Player'}</h1>
      <div className="stats-grid">
        {Array.isArray(stats) && stats.map(s => (
          <div key={s._id} className="stat-card">
            <h3>{s._id}</h3>
            <p>{s.totalMinutes} mins played</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleLog} className="log-form">
        <input value={gameName} onChange={e => setGameName(e.target.value)} placeholder="Game Name" required />
        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Minutes" required />
        <button type="submit" className="btn btn-primary">Log Session</button>
      </form>
    </div>
  );
}