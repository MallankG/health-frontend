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
  const [selectedPatient, setSelectedPatient] = useState('');
  const [patientOptions, setPatientOptions] = useState([]);

  const fetchLogs = async (pid) => {
    try {
      const res = await api.get(`/healthlogs?patient=${pid || user.id}`);
      setLogs(res.data);
    } catch {
      setError('Failed to fetch health logs');
    }
  };

  useEffect(() => {
    if (user.role === 'doctor' && selectedPatient) fetchLogs(selectedPatient);
    else if (user.role !== 'doctor') fetchLogs();
    // eslint-disable-next-line
  }, [selectedPatient]);

  useEffect(() => {
    if (user.role === 'doctor') {
      api.get('/users/search?q=').then(res => {
        const patients = res.data.filter(u => u.role === 'patient');
        setPatientOptions(patients);
        if (patients.length > 0 && !selectedPatient) {
          setSelectedPatient(patients[0]._id);
        }
      });
    }
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

  if (user.role === 'doctor') {
    return (
      <DashboardLayout>
        <div className="container-fluid">
          <div className="alert alert-info mt-4 text-center">Health Logs are not available for doctors.</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="fw-bold mb-0"><i className="bi bi-bar-chart-line me-2 text-primary"></i>Health Logs</h2>
            {user.role === 'doctor' && (
              <select className="form-select" style={{maxWidth: 300}} value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
                <option value="">Select Patient</option>
                {patientOptions.map(p => <option key={p._id} value={p._id}>{p.name} ({p.email})</option>)}
              </select>
            )}
            {user.role !== 'doctor' && (
              <form onSubmit={handleAdd} className="d-flex flex-wrap gap-2 align-items-center" style={{maxWidth: 600}}>
                <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="sleep">Sleep</option>
                  <option value="exercise">Exercise</option>
                </select>
                <input type="text" placeholder="Value (e.g. 8 hours, Running)" className="form-control" value={value} onChange={e => setValue(e.target.value)} />
                <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                <button type="submit" className="btn btn-success"><i className="bi bi-plus-circle me-1"></i>Add</button>
              </form>
            )}
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="row g-4">
          {logs.length === 0 ? (
            <div className="col-12 text-center text-muted">No health logs found.</div>
          ) : (
            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-bordered table-striped align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Type</th>
                      <th>Value</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(l => (
                      <tr key={l._id}>
                        <td>{l.type.charAt(0).toUpperCase() + l.type.slice(1)}</td>
                        <td>{l.value}</td>
                        <td>{new Date(l.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
