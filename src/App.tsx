import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';

// Simple placeholder for the Learn section
const Learn = () => (
  <div className="text-center py-20 text-slate-500 animate-fade-in">
    <h2 className="text-2xl font-bold text-white mb-2">Learning Modules</h2>
    <p>Gamified learning paths coming soon!</p>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="learn" element={<Learn />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
