// src/Appointments.jsx
import React, { useEffect, useState } from 'react';
import api from './api';
import DashboardLayout from './DashboardLayout';

export default function Appointments() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAppointments = async () => {
    try {
      // Use _id for query to match MongoDB ObjectId
      const res = await api.get(`/appointments?userId=${user._id || user.id}&role=${user.role}`);
      setAppointments(res.data);
    } catch {
      setError('Failed to fetch appointments');
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!doctor || !date) return setError('Doctor and date required');
    try {
      // Find doctor by name
      const userRes = await api.get(`/users/search?q=${encodeURIComponent(doctor)}`);
      const foundDoctor = userRes.data.find(u => u.role === 'doctor');
      if (!foundDoctor) return setError('Doctor not found');
      await api.post('/appointments/book', {
        patient: user.id,
        doctor: foundDoctor._id,
        date,
        purpose
      });
      setSuccess('Appointment booked!');
      setDoctor(''); setDate(''); setPurpose('');
      fetchAppointments();
    } catch {
      setError('Booking failed');
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="fw-bold mb-0"><i className="bi bi-calendar-check me-2 text-primary"></i>Appointments</h2>
            {user.role === 'patient' && (
              <form onSubmit={handleBook} className="d-flex flex-wrap gap-2 align-items-center" style={{maxWidth: 600}}>
                <input type="text" placeholder="Doctor Name" className="form-control" value={doctor} onChange={e => setDoctor(e.target.value)} />
                <input type="datetime-local" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                <input type="text" placeholder="Purpose" className="form-control" value={purpose} onChange={e => setPurpose(e.target.value)} />
                <button type="submit" className="btn btn-success"><i className="bi bi-plus-circle me-1"></i>Book</button>
              </form>
            )}
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="row g-4">
          {appointments.length === 0 && <div className="col-12 text-center text-muted">No appointments found.</div>}
          {appointments.map(a => (
            <div className="col-md-6 col-lg-4" key={a._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title mb-2">{a.date && new Date(a.date).toLocaleString()}</h5>
                  <div className="mb-2"><span className="badge bg-primary me-2"><i className="bi bi-info-circle me-1"></i>{a.status}</span></div>
                  <div className="mb-2">Doctor: <span className="fw-semibold">{a.doctor?.name || a.doctor}</span></div>
                  <div className="mb-2">Patient: <span className="fw-semibold">{a.patient?.name || a.patient}</span></div>
                  {a.purpose && <div className="mb-2">Purpose: {a.purpose}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
