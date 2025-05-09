// src/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

// Modal for direct password reset
function ResetPasswordModal({ show, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!email) return setError('Email required');
    if (!password || password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await api.post('/auth/reset-password-direct', { email, password });
      setMessage('Password reset successful! You can now log in.');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;
  return (
    <div className="modal d-block" tabIndex="-1" style={{background:'rgba(0,0,0,0.3)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reset Password</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body d-flex flex-column gap-2">
              <input type="email" className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <input type="password" className="form-control" placeholder="New Password" value={password} onChange={e=>setPassword(e.target.value)} required />
              <input type="password" className="form-control" placeholder="Confirm Password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
              {error && <div className="alert alert-danger p-2 text-center">{error}</div>}
              {message && <div className="alert alert-success p-2 text-center">{message}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      // Debug: Confirm values are set before navigating
      console.log('Token set:', localStorage.getItem('token'));
      console.log('User set:', localStorage.getItem('user'));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{maxWidth: 400, width: '100%'}}>
        <div className="card-body">
          <h2 className="mb-4 text-center" style={{color: '#2563eb', fontWeight: 700}}>Login</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
            {error && <div className="alert alert-danger mt-2 p-2 text-center">{error}</div>}
          </form>
          <div className="mt-3 text-center text-secondary">
            Don't have an account? <Link to="/register" className="text-primary">Register</Link>
          </div>
          <div className="mt-3 text-center text-secondary">
            <span className="text-primary" style={{cursor:'pointer'}} onClick={()=>setShowReset(true)}>Forgot Password?</span>
          </div>
          <ResetPasswordModal show={showReset} onClose={()=>setShowReset(false)} />
        </div>
      </div>
    </div>
  );
}
