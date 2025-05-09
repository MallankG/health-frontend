// src/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      navigate('/dashboard');
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
            <Link to="/forgot-password" className="text-primary">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
