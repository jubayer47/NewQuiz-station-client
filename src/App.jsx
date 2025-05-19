import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';
import './App.css';
import Signup from "./components/Signup";
import Profile from "./components/profile";
import Login from "./components/Login";
import Leaderboard from "./components/leaderboard";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Quiz Master</h1>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz/:sessionId" element={<QuizPage />} />
            <Route path="/results/:sessionId" element={<ResultsPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Quiz Master</p>
        </footer>
      </div>
    </Router>
  );
}

export default App
