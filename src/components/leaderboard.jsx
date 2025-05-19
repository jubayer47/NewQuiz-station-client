import React, { useEffect, useState } from 'react';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch leaderboard');
        setLeaders(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLeaders();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!leaders.length) return <p>No data found.</p>;

  return (
    <div className="leaderboard-container">
      <h2>Top 10 Players</h2>
      <ol>
        {leaders.map((user, index) => (
          <li key={index}>
            {user.username} - Score: {user.highestScore}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
