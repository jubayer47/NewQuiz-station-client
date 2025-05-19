// src/services/apiService.js
const API_URL = "http://localhost:5000/api";

export const startQuiz = async (questionCount = 10) => {
  try {
    const response = await fetch(`${API_URL}/quiz/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionCount }),
    });

    if (!response.ok) {
      throw new Error("Failed to start quiz");
    }

    return await response.json();
  } catch (error) {
    console.error("Error starting quiz:", error);
    throw error;
  }
};

export const submitQuizAnswers = async (sessionId, answers) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/quiz/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // Add token if exists
      },
      body: JSON.stringify({ sessionId, answers }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit answers");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting answers:", error);
    throw error;
  }
};


export const getQuizResults = async (sessionId) => {
  try {
    const response = await fetch(`${API_URL}/quiz/results/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get quiz results');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting quiz results:', error);
    throw error;
  }
};