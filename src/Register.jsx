// src/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{maxWidth: 400, width: '100%'}}>
        <div className="card-body">
          <h2 className="mb-4 text-center" style={{color: '#2563eb', fontWeight: 700}}>Register</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label htmlFor="name" className="form-label">Name</label>
              <input id="name" type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <input id="password" type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="role" className="form-label">Role</label>
              <select id="role" className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
            {error && <div className="alert alert-danger mt-2 p-2 text-center">{error}</div>}
          </form>
          <div className="mt-3 text-center text-secondary">
            Already have an account? <Link to="/login" className="text-primary">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
