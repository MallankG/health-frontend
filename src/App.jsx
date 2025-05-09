import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import Reports from './Reports';
import Appointments from './Appointments';
import HealthLogs from './HealthLogs';
import Vitals from './Vitals';
import Chat from './Chat';
import LandingPage from './LandingPage';
import Notifications from './Notifications';
import Dashboard from './Dashboard';
import DoctorDashboard from './DoctorDashboard';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import DashboardLayout from './DashboardLayout';
import Patients from './Patients';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const onStorage = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/appointments" element={isAuthenticated ? <Appointments /> : <Navigate to="/login" />} />
        <Route path="/healthlogs" element={isAuthenticated ? <HealthLogs /> : <Navigate to="/login" />} />
        <Route path="/vitals" element={isAuthenticated ? <Vitals /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/login" />} />
        <Route path="/doctor-dashboard" element={isAuthenticated ? (
          <DashboardLayout>
            <DoctorDashboard />
          </DashboardLayout>
        ) : <Navigate to="/login" />} />
        <Route path="/patients" element={isAuthenticated ? (
          <DashboardLayout>
            <Patients />
          </DashboardLayout>
        ) : <Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
