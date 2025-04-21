// src/Vitals.jsx
import React, { useEffect, useState } from 'react';
import api from './api';
import DashboardLayout from './DashboardLayout';

export default function Vitals() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [vitals, setVitals] = useState([]);
  const [type, setType] = useState('bp');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchVitals = async () => {
    try {
      console.log('user', user);
      const res = await api.get(`/vitals?patient=${user._id || user.id}`);
      console.log('vitals', res.data);
      setVitals(res.data);
    } catch {
      setError('Failed to fetch vitals');
    }
  };

  useEffect(() => {
    fetchVitals();
    // eslint-disable-next-line
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!value || !date) return setError('Value and date required');
    try {
      await api.post('/vitals/add', {
        patient: user.id,
        type,
        value,
        date
      });
      setSuccess('Vital added!');
      setValue(''); setDate('');
      fetchVitals();
    } catch {
      setError('Add failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="fw-bold mb-0"><i className="bi bi-heart-pulse me-2 text-primary"></i>Vitals</h2>
            <form onSubmit={handleAdd} className="d-flex flex-wrap gap-2 align-items-center" style={{maxWidth: 600}}>
              <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                <option value="bp">Blood Pressure</option>
                <option value="hr">Heart Rate</option>
                <option value="glucose">Glucose</option>
                <option value="other">Other</option>
              </select>
              <input type="text" placeholder="Value (e.g. 120/80, 72 bpm)" className="form-control" value={value} onChange={e => setValue(e.target.value)} />
              <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
              <button type="submit" className="btn btn-success"><i className="bi bi-plus-circle me-1"></i>Add</button>
            </form>
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="row g-4">
          {vitals.length === 0 && <div className="col-12 text-center text-muted">No vitals found.</div>}
          {vitals.map(v => (
            <div className="col-md-6 col-lg-4" key={v._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-2">{v.type.charAt(0).toUpperCase() + v.type.slice(1)}</h5>
                  <div className="mb-2"><span className="badge bg-primary me-2"><i className="bi bi-activity me-1"></i>{v.value}</span></div>
                  <div className="mb-2">{new Date(v.date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
