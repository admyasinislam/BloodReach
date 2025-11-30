import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';

// Mock empty component for Health Tips
const HealthTips = () => (
  <div className="max-w-4xl mx-auto p-8 text-center text-slate-500">
    <h2 className="text-2xl font-bold mb-4">স্বাস্থ্য পরামর্শ</h2>
    <p>শীঘ্রই আসছে...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen bg-slate-50 font-sans">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/health-tips" element={<HealthTips />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;