// src/Notifications.jsx
import React from 'react';
import DashboardLayout from './DashboardLayout';

export default function Notifications() {
  // This is a stub. You can fetch and display notifications here.
  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="fw-bold mb-0"><i className="bi bi-bell me-2 text-primary"></i>Notifications</h2>
          </div>
        </div>
        <div className="alert alert-info text-center"><i className="bi bi-info-circle me-2"></i>No notifications yet. You’ll see appointment reminders, new messages, and report upload alerts here.</div>
      </div>
    </DashboardLayout>
  );
}
