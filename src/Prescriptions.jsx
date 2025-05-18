import React, { useEffect, useState } from 'react';
import api from './api';

function PrescriptionForm({ patient, onSuccess }) {
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '' }
  ]);
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMedChange = (idx, field, value) => {
    setMedications(meds => meds.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const removeMedication = (idx) => {
    setMedications(meds => meds.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const doctorId = user && (user._id || user.id);
      if (!doctorId) {
        setError('Doctor ID not found. Please log in again.');
        setLoading(false);
        return;
      }
      const payload = {
        patientId: patient._id,
        doctorId,
        medications,
        instructions
      };
      console.log('Prescription payload:', payload);
      await api.post('/prescriptions', payload);
      setSuccess('Prescription created!');
      setMedications([{ name: '', dosage: '', frequency: '' }]);
      setInstructions('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">Write Prescription</h5>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          {medications.map((med, idx) => (
            <div className="row mb-2" key={idx}>
              <div className="col">
                <input type="text" className="form-control" placeholder="Medication Name" value={med.name} onChange={e => handleMedChange(idx, 'name', e.target.value)} required />
              </div>
              <div className="col">
                <input type="text" className="form-control" placeholder="Dosage" value={med.dosage} onChange={e => handleMedChange(idx, 'dosage', e.target.value)} required />
              </div>
              <div className="col">
                <input type="text" className="form-control" placeholder="Frequency" value={med.frequency} onChange={e => handleMedChange(idx, 'frequency', e.target.value)} required />
              </div>
              <div className="col-auto">
                {medications.length > 1 && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeMedication(idx)}>&times;</button>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-link p-0 mb-2" onClick={addMedication}>+ Add Medication</button>
          <div className="mb-2">
            <textarea className="form-control" placeholder="Instructions (optional)" value={instructions} onChange={e => setInstructions(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Create Prescription'}</button>
        </form>
      </div>
    </div>
  );
}

const Prescriptions = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refillStatus, setRefillStatus] = useState({});
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (user.role === 'doctor') {
      api.get('/users/search?q=').then(res => {
        setPatients(res.data.filter(u => u.role === 'patient'));
      });
    }
    fetchPrescriptions();
    // eslint-disable-next-line
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/prescriptions');
      setPrescriptions(res.data);
    } catch {
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await api.get(`/prescriptions/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download prescription');
    }
  };

  const handleRefill = async (id) => {
    setRefillStatus(s => ({ ...s, [id]: 'loading' }));
    try {
      await api.post(`/prescriptions/${id}/refill`);
      setRefillStatus(s => ({ ...s, [id]: 'requested' }));
      fetchPrescriptions();
    } catch {
      setRefillStatus(s => ({ ...s, [id]: 'error' }));
    }
  };

  return (
    <div className="container mt-4">
      <h2>Prescriptions</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {user.role === 'doctor' && (
        <div className="mb-3">
          <label>Select Patient:</label>
          <select className="form-select" style={{maxWidth: 300}} value={selectedPatient?selectedPatient._id:''} onChange={e => {
            const p = patients.find(p => p._id === e.target.value);
            setSelectedPatient(p);
          }}>
            <option value="">Select Patient</option>
            {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p.email})</option>)}
          </select>
          {selectedPatient && <PrescriptionForm patient={selectedPatient} onSuccess={fetchPrescriptions} />}
        </div>
      )}
      {loading ? <div>Loading...</div> : (
        prescriptions.length === 0 ? (
          <div className="text-center text-muted">No prescriptions to show</div>
        ) : (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Date</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Medications</th>
                <th>Instructions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map(p => (
                <tr key={p._id}>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td>{p.doctorId?.name || '-'}</td>
                  <td>{p.patientId?.name || '-'}</td>
                  <td>
                    <ul className="mb-0">
                      {p.medications.map((m, i) => (
                        <li key={i}>{m.name} - {m.dosage} - {m.frequency}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{p.instructions}</td>
                  <td>{p.status}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleDownload(p._id)}>Download</button>
                    {user.role === 'patient' && p.status === 'active' && (
                      <button className="btn btn-sm btn-outline-success" onClick={() => handleRefill(p._id)} disabled={refillStatus[p._id]==='loading'}>
                        {refillStatus[p._id]==='requested' ? 'Requested' : 'Request Refill'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default Prescriptions;
