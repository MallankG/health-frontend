import React, { useEffect, useState } from 'react';
import api from './api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/users/search?q='); // Empty query returns all
        setPatients(res.data.filter(u => u.role === 'patient'));
      } catch {
        setError('Failed to fetch patients');
      }
    };
    fetchPatients();
  }, []);

  return (
    <div>
      <h2>Patients</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div style={{ display: 'flex', gap: 32 }}>
        <div style={{ minWidth: 250 }}>
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
              {/* Tabs for reports, vitals, health logs */}
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
        <button className={`btn btn-sm ${tab==='logs'?'btn-primary':'btn-outline-primary'}`} onClick={()=>setTab('logs')}>Health Logs</button>
      </div>
      {tab==='reports' && <PatientReports patientId={patientId} />}
      {tab==='vitals' && <PatientVitals patientId={patientId} />}
      {tab==='logs' && <PatientHealthLogs patientId={patientId} />}
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
function PatientHealthLogs({ patientId }) {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    api.get(`/healthlogs?patient=${patientId}`).then(res => setLogs(res.data));
  }, [patientId]);
  return (
    <div>
      <h5>Health Logs</h5>
      <ul className="list-group">
        {logs.map(l => <li key={l._id} className="list-group-item">{l.type}: {l.value} ({new Date(l.date).toLocaleDateString()})</li>)}
      </ul>
    </div>
  );
}

export default Patients;
