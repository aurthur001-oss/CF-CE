import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import TradingDashboard from './pages/TradingDashboard';
import StorageRentals from './pages/StorageRentals';
import Marketplace from './pages/Marketplace';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          <Navbar />
          <Routes>
            {/* New Landing Page as Root */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Feature Pages - Protected logic is inside them (for now) or we can move them later */}
            <Route path="/trading" element={<TradingDashboard />} />
            <Route path="/storage" element={<StorageRentals />} />
            <Route path="/marketplace" element={<Marketplace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
