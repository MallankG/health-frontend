import React, { useEffect, useState } from 'react';
import api from './api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients('');
  }, []);

  const fetchPatients = async (searchTerm) => {
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(searchTerm)}`);
      setPatients(res.data.filter(u => u.role === 'patient'));
    } catch {
      setError('Failed to fetch patients');
    }
  };

  return (
    <div>
      <h2>Patients</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div style={{ display: 'flex', gap: 32 }}>
        <div style={{ minWidth: 250 }}>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search by name or email..."
            onChange={e => fetchPatients(e.target.value)}
          />
          <ul className="list-group">
            {patients.map(p => (
              <li
                key={p._id}
                className={`list-group-item${selectedPatient && selectedPatient._id === p._id ? ' active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedPatient(p)}
              >
                {p.name} <span className="text-muted small">({p.email})</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          {selectedPatient ? (
            <div>
              <h4>{selectedPatient.name}</h4>
              <p>Email: {selectedPatient.email}</p>
              <p>Role: {selectedPatient.role}</p>
              {/* Tabs for reports, vitals */}
              <Tabs patientId={selectedPatient._id} />
            </div>
          ) : (
            <div className="text-muted">Select a patient to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
};

function Tabs({ patientId }) {
  const [tab, setTab] = useState('reports');
  return (
    <div>
      <div className="mb-3">
        <button className={`btn btn-sm me-2 ${tab==='reports'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setTab('reports')}>Reports</button>
        <button className={`btn btn-sm me-2 ${tab==='vitals'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setTab('vitals')}>Vitals</button>
        {/* Removed Health Logs tab for doctorside */}
      </div>
      {tab==='reports' && <PatientReports patientId={patientId} />}
      {tab==='vitals' && <PatientVitals patientId={patientId} />}
      {/* Removed PatientHealthLogs for doctorside */}
    </div>
  );
}

function PatientReports({ patientId }) {
  const [reports, setReports] = useState([]);
  useEffect(() => {
    api.get(`/reports?patient=${patientId}`).then(res => setReports(res.data));
  }, [patientId]);
  return (
    <div>
      <h5>Reports</h5>
      <ul className="list-group">
        {reports.map(r => <li key={r._id} className="list-group-item">{r.fileUrl.split('/').pop()}</li>)}
      </ul>
    </div>
  );
}
function PatientVitals({ patientId }) {
  const [vitals, setVitals] = useState([]);
  useEffect(() => {
    api.get(`/vitals?patient=${patientId}`).then(res => setVitals(res.data));
  }, [patientId]);
  return (
    <div>
      <h5>Vitals</h5>
      <ul className="list-group">
        {vitals.map(v => <li key={v._id} className="list-group-item">{v.type}: {v.value} ({new Date(v.date).toLocaleDateString()})</li>)}
      </ul>
    </div>
  );
}

export default Patients;
