import React, { useState } from 'react';
import api from './api';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('If this email exists, a reset link has been sent. (Check your email or ask the admin for the link in server logs.)');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{maxWidth: 400, width: '100%'}}>
        <div className="card-body">
          <h2 className="mb-4 text-center" style={{color: '#2563eb', fontWeight: 700}}>Forgot Password</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
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