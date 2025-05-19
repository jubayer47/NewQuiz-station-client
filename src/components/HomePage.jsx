// src/components/HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startQuiz } from '../services/apiService';
import '../style/HomePage.css';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questionCount, setQuestionCount] = useState(10);
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const quizData = await startQuiz(questionCount);
      
      // Store quiz data in session storage
      sessionStorage.setItem(`quiz_${quizData.sessionId}`, JSON.stringify(quizData));
      
      navigate(`/quiz/${quizData.sessionId}`);
    } catch (err) {
      setError('Failed to start the quiz. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h2>Welcome to Quiz Master!</h2>
        <p>Test your knowledge with our exciting quiz questions.</p>
        
        <div className="question-count-selector">
          <label htmlFor="question-count">Number of Questions:</label>
          <input
            type="range"
            id="question-count"
            min="5"
            max="20"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
          />
          <span>{questionCount}</span>
        </div>
        
        <button 
          className="start-button"
          onClick={handleStartQuiz}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Start Quiz'}
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default HomePage;