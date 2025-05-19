import React, { useEffect, useState } from 'react';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setError('You must be logged in.');

      try {
        const res = await fetch('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');
        setUserData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!userData) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>{userData?.username}'s Profile</h2>
      <p>Email: {userData?.email}</p>
      <h3>Quiz History</h3>
      <ul>
        {userData?.scores?.map((quiz, index) => (
          <li key={index}>
            Score: {quiz.score}/{quiz.totalQuestions}, Time: {quiz.timeSpent}s, Date: {new Date(quiz.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
