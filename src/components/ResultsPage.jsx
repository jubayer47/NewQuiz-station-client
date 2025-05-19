// src/components/ResultsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizResults } from '../services/apiService';
import '../style/ResultsPage.css';

const ResultsPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Try to get results from session storage first
        const cachedResults = sessionStorage.getItem(`quiz_results_${sessionId}`);
        
        if (cachedResults) {
          setResults(JSON.parse(cachedResults));
          setLoading(false);
          return;
        }
        
        // If not in session storage, fetch from API
        const data = await getQuizResults(sessionId);
        setResults(data);
        
        // Cache results
        sessionStorage.setItem(`quiz_results_${sessionId}`, JSON.stringify(data));
      } catch (err) {
        setError('Failed to load quiz results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [sessionId]);
  
  const handlePlayAgain = () => {
    // Clear session storage for this quiz
    sessionStorage.removeItem(`quiz_${sessionId}`);
    sessionStorage.removeItem(`quiz_results_${sessionId}`);
    
    navigate('/');
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (loading) {
    return <div className="loading">Loading results...</div>;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button onClick={handlePlayAgain}>Back to Home</button>
      </div>
    );
  }
  
  // Determine score category for styling
  let scoreCategory;
  if (results.percentage >= 80) {
    scoreCategory = 'high';
  } else if (results.percentage >= 50) {
    scoreCategory = 'medium';
  } else {
    scoreCategory = 'low';
  }
  
  return (
    <div className="results-container">
      <div className="results-card">
        <h2>Quiz Complete!</h2>
        
        <div className="score-summary">
          <div className={`score-circle ${scoreCategory}`}>
            <div className="score-percentage">{results.percentage}%</div>
            <div className="score-ratio">
              {results.score}/{results.totalQuestions}
            </div>
          </div>
          
          <div className="stats">
            <p>Time spent: {formatTime(results.timeSpent)}</p>
            <p className="score-message">
              {results.percentage >= 80 ? 'Excellent job!' : 
               results.percentage >= 60 ? 'Good work!' : 
               results.percentage >= 40 ? 'Not bad.' : 'Keep practicing!'}
            </p>
          </div>
        </div>
        
        <div className="result-actions">
          <button className="primary-button" onClick={handlePlayAgain}>
            Play Again
          </button>
          <button 
            className="secondary-button" 
            onClick={() => setShowAnswers(!showAnswers)}
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
        </div>
        
        {showAnswers && (
          <div className="answers-section">
            <h3>Question Review</h3>
            <ul className="answers-list">
              {results.detailedResults.map((item, index) => (
                <li key={index} className={`answer-item ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                  <p className="question-text">{item.question}</p>
                  <div className="answer-details">
                    <p>Your answer: {item.userAnswer ? 
                        <strong>{item.userAnswer}: {item.options[item.userAnswer]}</strong> : 
                        <em>No answer provided</em>}
                    </p>
                    <p>Correct answer: <strong>{item.correctAnswer}: {item.options[item.correctAnswer]}</strong></p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;