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
  const [doctorSuggestions, setDoctorSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  // Doctor accepts appointment
  const handleAccept = async (id) => {
    setError(''); setSuccess('');
    try {
      await api.patch(`/appointments/${id}/accept`);
      setSuccess('Appointment accepted.');
      fetchAppointments();
    } catch {
      setError('Failed to accept appointment');
    }
  };

  // Doctor denies/cancels appointment
  const handleDeny = async (id) => {
    setError(''); setSuccess('');
    try {
      await api.patch(`/appointments/${id}/cancel`);
      setSuccess('Appointment denied/cancelled.');
      fetchAppointments();
    } catch {
      setError('Failed to deny/cancel appointment');
    }
  };

  // Autocomplete for doctor name
  const handleDoctorInput = async (e) => {
    const value = e.target.value;
    setDoctor(value);
    if (value.length < 2) {
      setDoctorSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(value)}`);
      setDoctorSuggestions(res.data.filter(u => u.role === 'doctor'));
      setShowSuggestions(true);
    } catch {
      setDoctorSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectDoctor = (d) => {
    setDoctor(d.name);
    setDoctorSuggestions([]);
    setShowSuggestions(false);
  };

  // Helper to format date as dd/mm/yyyy
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="fw-bold mb-0"><i className="bi bi-calendar-check me-2 text-primary"></i>Appointments</h2>
            {/* Only show booking form for patients */}
            {user.role === 'patient' && (
              <form onSubmit={handleBook} className="d-flex flex-wrap gap-2 align-items-center" style={{maxWidth: 600, position: 'relative'}}>
                <div style={{position: 'relative', width: 200}}>
                  <input
                    type="text"
                    placeholder="Doctor Name"
                    className="form-control"
                    value={doctor}
                    onChange={handleDoctorInput}
                    autoComplete="off"
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    onFocus={() => doctorSuggestions.length > 0 && setShowSuggestions(true)}
                  />
                  {showSuggestions && doctorSuggestions.length > 0 && (
                    <ul className="list-group position-absolute w-100" style={{zIndex: 10, top: '100%'}}>
                      {doctorSuggestions.map(d => (
                        <li
                          key={d._id}
                          className="list-group-item list-group-item-action"
                          style={{cursor: 'pointer'}}
                          onMouseDown={() => handleSelectDoctor(d)}
                        >
                          {d.name} <span className="text-muted small">({d.email})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <input type="datetime-local" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                <input type="text" placeholder="Purpose" className="form-control" value={purpose} onChange={e => setPurpose(e.target.value)} />
                <button type="submit" className="btn btn-success"><i className="bi bi-plus-circle me-1"></i>Book</button>
              </form>
            )}
            {/* For doctors, optionally add a patient filter */}
            {user.role === 'doctor' && (
              <input
                type="text"
                placeholder="Filter by patient name..."
                className="form-control"
                style={{maxWidth: 200}}
                onChange={async e => {
                  const val = e.target.value;
                  try {
                    const res = await api.get(`/appointments?userId=${user._id || user.id}&role=doctor&patientName=${encodeURIComponent(val)}`);
                    setAppointments(res.data);
                  } catch {
                    setError('Failed to fetch appointments');
                  }
                }}
              />
            )}
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="row g-4">
          {appointments.length === 0 && <div className="col-12 text-center text-muted">No appointments found.</div>}
          {appointments
            .slice() // copy array
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // latest first
            .map(a => (
              <div className="col-md-6 col-lg-4" key={a._id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-2">{a.date && formatDate(a.date)}</h5>
                    <div className="mb-2"><span className="badge bg-primary me-2"><i className="bi bi-info-circle me-1"></i>{a.status}</span></div>
                    <div className="mb-2">Doctor: <span className="fw-semibold">{a.doctor?.name || a.doctor}</span></div>
                    <div className="mb-2">Patient: <span className="fw-semibold">{a.patient?.name || a.patient}</span></div>
                    {a.purpose && <div className="mb-2">Purpose: {a.purpose}</div>}
                    {/* Doctor actions for requested appointments */}
                    {user.role === 'doctor' && a.status === 'requested' && (
                      <div className="mt-2 d-flex gap-2">
                        <button className="btn btn-success btn-sm" onClick={() => handleAccept(a._id)}>
                          <i className="bi bi-check-circle me-1"></i>Accept
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeny(a._id)}>
                          <i className="bi bi-x-circle me-1"></i>Deny
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
