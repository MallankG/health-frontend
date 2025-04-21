// src/HealthLogs.jsx
import React, { useEffect, useState } from 'react';
import api from './api';
import DashboardLayout from './DashboardLayout';

export default function HealthLogs() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [logs, setLogs] = useState([]);
  const [type, setType] = useState('sleep');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await api.get(`/healthlogs?patient=${user.id}`);
      setLogs(res.data);
    } catch {
      setError('Failed to fetch health logs');
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!value || !date) return setError('Value and date required');
    try {
      await api.post('/healthlogs/add', {
        patient: user.id,
        type,
        value,
        date
      });
      setSuccess('Log added!');
      setValue(''); setDate('');
      fetchLogs();
    } catch {
      setError('Add failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="fw-bold mb-0"><i className="bi bi-bar-chart-line me-2 text-primary"></i>Health Logs</h2>
            <form onSubmit={handleAdd} className="d-flex flex-wrap gap-2 align-items-center" style={{maxWidth: 600}}>
              <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                <option value="sleep">Sleep</option>
                <option value="exercise">Exercise</option>
              </select>
              <input type="text" placeholder="Value (e.g. 8 hours, Running)" className="form-control" value={value} onChange={e => setValue(e.target.value)} />
              <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
              <button type="submit" className="btn btn-success"><i className="bi bi-plus-circle me-1"></i>Add</button>
            </form>
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="row g-4">
          {logs.length === 0 && <div className="col-12 text-center text-muted">No health logs found.</div>}
          {logs.map(l => (
            <div className="col-md-6 col-lg-4" key={l._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-2">{l.type.charAt(0).toUpperCase() + l.type.slice(1)}</h5>
                  <div className="mb-2"><span className="badge bg-primary me-2"><i className="bi bi-activity me-1"></i>{l.value}</span></div>
                  <div className="mb-2">{new Date(l.date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
