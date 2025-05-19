// src/components/QuizPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitQuizAnswers } from '../services/apiService';
import '../style/QuizPage.css';

const QuizPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [quizState, setQuizState] = useState({
    questions: [],
    loading: true,
    error: null,
    userAnswers: {},
    currentQuestionIndex: 0,
    timeStarted: Date.now()
  });
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get questions from session storage
  useEffect(() => {
    const quizData = sessionStorage.getItem(`quiz_${sessionId}`);
    
    if (quizData) {
      const parsedData = JSON.parse(quizData);
      setQuizState(prev => ({
        ...prev,
        questions: parsedData.questions,
        loading: false,
        userAnswers: Array(parsedData.questions.length).fill('').reduce((acc, _, idx) => ({
          ...acc,
          [idx]: ''
        }), {})
      }));
    } else {
      navigate('/');
    }
  }, [sessionId, navigate]);
  
  // Timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - quizState.timeStarted) / 1000));
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [quizState.timeStarted]);
  
  const handleAnswerSelect = (questionIndex, option) => {
    setQuizState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [questionIndex]: option
      }
    }));
  };
  
  const navigateToQuestion = (index) => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: index
    }));
  };
  
  const handleNextQuestion = () => {
    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      navigateToQuestion(quizState.currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      navigateToQuestion(quizState.currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    
    try {
      // Convert from object to array format for API
      const answersArray = Object.keys(quizState.userAnswers).map(
        index => quizState.userAnswers[index]
      );
      
      const results = await submitQuizAnswers(sessionId, answersArray);
      
      // Store results in session storage for results page
      sessionStorage.setItem(`quiz_results_${sessionId}`, JSON.stringify(results));
      
      // Navigate to results page
      navigate(`/results/${sessionId}`);
    } catch (err) {
      setQuizState(prev => ({
        ...prev,
        error: 'Failed to submit quiz. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  if (quizState.loading) {
    return <div className="loading">Loading questions...</div>;
  }
  
  if (quizState.error) {
    return <div className="error">{quizState.error}</div>;
  }
  
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const answeredQuestionsCount = Object.values(quizState.userAnswers).filter(a => a !== '').length;
  
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          <span>Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-filled" 
              style={{ width: `${(answeredQuestionsCount / quizState.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="quiz-timer">
          Time: {formatTime(timeElapsed)}
        </div>
      </div>
      
      <div className="question-box">
        <h2>{currentQuestion.question}</h2>
        
        <div className="options">
          {['A', 'B', 'C', 'D'].map((option) => (
            <button
              key={option}
              className={`option ${quizState.userAnswers[quizState.currentQuestionIndex] === option ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(quizState.currentQuestionIndex, option)}
            >
              <span className="option-letter">{option}</span>
              <span className="option-text">{currentQuestion[option]}</span>
            </button>
          ))}
        </div>
        
        <div className="navigation-buttons">
          <button 
            className="nav-button"
            disabled={quizState.currentQuestionIndex === 0}
            onClick={handlePrevQuestion}
          >
            Previous
          </button>
          
          {quizState.currentQuestionIndex < quizState.questions.length - 1 ? (
            <button 
              className="nav-button"
              onClick={handleNextQuestion}
            >
              Next
            </button>
          ) : (
            <button 
              className="submit-button"
              onClick={handleSubmitQuiz}
              disabled={answeredQuestionsCount < quizState.questions.length || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
      
      <div className="question-navigation">
        <div className="navigation-title">Question Navigation</div>
        <div className="question-indicators">
          {quizState.questions.map((_, idx) => (
            <button 
              key={idx}
              className={`indicator ${quizState.currentQuestionIndex === idx ? 'current' : ''} ${quizState.userAnswers[idx] ? 'answered' : ''}`}
              onClick={() => navigateToQuestion(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <div className='answers-count'>
          <p>{answeredQuestionsCount}/{quizState.questions.length}</p>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;