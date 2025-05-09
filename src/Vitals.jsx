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
  const [patientOptions, setPatientOptions] = useState([]);
  const [expandedPatient, setExpandedPatient] = useState(null);

  const fetchVitals = async (pid) => {
    try {
      const res = await api.get(`/vitals?patient=${pid || user._id || user.id}`);
      setVitals(res.data);
    } catch {
      setError('Failed to fetch vitals');
    }
  };

  useEffect(() => {
    if (user.role === 'doctor') {
      api.get('/users/search?q=').then(res => {
        const patients = res.data.filter(u => u.role === 'patient');
        setPatientOptions(patients);
      });
    }
    if (user.role !== 'doctor') fetchVitals();
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

  // Helper to group vitals by type
  function groupByType(vitals) {
    return vitals.reduce((acc, v) => {
      acc[v.type] = acc[v.type] || [];
      acc[v.type].push(v);
      return acc;
    }, {});
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="fw-bold mb-0"><i className="bi bi-heart-pulse me-2 text-primary"></i>Vitals</h2>
            {user.role !== 'doctor' && (
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
            )}
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {user.role === 'doctor' ? (
          <div className="row g-4">
            {patientOptions.length === 0 && <div className="col-12 text-center text-muted">No patients found.</div>}
            {patientOptions.map(p => (
              <div className="col-md-6 col-lg-4" key={p._id}>
                <div className="card shadow-sm h-100" style={{cursor:'pointer'}} onClick={() => setExpandedPatient(expandedPatient === p._id ? null : p._id)}>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-2">{p.name}</h5>
                    <div className="mb-2">{p.email}</div>
                    {expandedPatient === p._id && <PatientVitals patientId={p._id} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-4">
            {vitals.length === 0 ? (
              <div className="col-12 text-center text-muted">No vitals found.</div>
            ) : (
              Object.entries(groupByType(vitals)).map(([type, vitalsArr]) => (
                <div className="col-12" key={type}>
                  <div className="card shadow-sm mb-3">
                    <div className="card-body">
                      <h5 className="card-title mb-3">{type === 'bp' ? 'Blood Pressure' : type === 'hr' ? 'Heart Rate' : type === 'glucose' ? 'Glucose' : 'Other'}</h5>
                      <div className="table-responsive">
                        <table className="table table-bordered table-striped align-middle mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Value</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vitalsArr.map(v => (
                              <tr key={v._id}>
                                <td>{v.value}</td>
                                <td>{new Date(v.date).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function PatientVitals({ patientId }) {
  const [vitals, setVitals] = useState([]);
  useEffect(() => {
    api.get(`/vitals?patient=${patientId}`).then(res => setVitals(res.data));
  }, [patientId]);
  if (vitals.length === 0) return <div className="text-muted">No vitals found.</div>;
  // Group by type
  const grouped = vitals.reduce((acc, v) => {
    acc[v.type] = acc[v.type] || [];
    acc[v.type].push(v);
    return acc;
  }, {});
  return (
    <div>
      {Object.entries(grouped).map(([type, vitalsArr]) => (
        <div key={type} className="mb-3">
          <h6 className="fw-bold mb-2">{type === 'bp' ? 'Blood Pressure' : type === 'hr' ? 'Heart Rate' : type === 'glucose' ? 'Glucose' : 'Other'}</h6>
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Value</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {vitalsArr.map(v => (
                  <tr key={v._id}>
                    <td>{v.value}</td>
                    <td>{new Date(v.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
