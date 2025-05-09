import React, { useState } from 'react';
import api from './api';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    if (!password || password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, token, password });
      setMessage('Password reset successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <div className="card shadow p-4" style={{maxWidth: 400, width: '100%'}}>
          <div className="card-body text-center">
            <h2 className="mb-4" style={{color: '#2563eb', fontWeight: 700}}>Reset Password</h2>
            <div className="alert alert-danger">Invalid or missing reset link.</div>
            <Link to="/login" className="btn btn-primary mt-3">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{maxWidth: 400, width: '100%'}}>
        <div className="card-body">
          <h2 className="mb-4 text-center" style={{color: '#2563eb', fontWeight: 700}}>Reset Password</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label htmlFor="password" className="form-label">New Password</label>
              <input id="password" type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="confirm" className="form-label">Confirm Password</label>
              <input id="confirm" type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            {error && <div className="alert alert-danger mt-2 p-2 text-center">{error}</div>}
            {message && <div className="alert alert-success mt-2 p-2 text-center">{message}</div>}
          </form>
          <div className="mt-3 text-center text-secondary">
            <Link to="/login" className="text-primary">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}