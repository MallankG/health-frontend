import React, { useState } from 'react';
import Appointments from './Appointments';
import Reports from './Reports';
import Vitals from './Vitals';
import HealthLogs from './HealthLogs';
import Chat from './Chat';
import Notifications from './Notifications';
import Patients from './Patients';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');

  const renderTab = () => {
    switch (activeTab) {
      case 'appointments':
        return <Appointments doctorView={true} />;
      case 'patients':
        return <Patients doctorView={true} />;
      case 'reports':
        return <Reports doctorView={true} />;
      case 'vitals':
        return <Vitals doctorView={true} />;
      case 'healthlogs':
        return <HealthLogs doctorView={true} />;
      case 'chat':
        return <Chat doctorView={true} />;
      case 'notifications':
        return <Notifications doctorView={true} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{
        width: '220px',
        background: '#f5f5f5',
        padding: '2rem 1rem',
        borderRight: '1px solid #ddd',
        minHeight: '100vh',
      }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '2rem' }}>Doctor Panel</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><button onClick={() => setActiveTab('appointments')} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: activeTab === 'appointments' ? '#e0e0e0' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Appointments</button></li>
          <li><button onClick={() => setActiveTab('patients')} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: activeTab === 'patients' ? '#e0e0e0' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Patients</button></li>
          <li><button onClick={() => setActiveTab('reports')} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: activeTab === 'reports' ? '#e0e0e0' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Reports</button></li>
          <li><button onClick={() => setActiveTab('vitals')} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: activeTab === 'vitals' ? '#e0e0e0' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Vitals</button></li>
          <li><button onClick={() => setActiveTab('healthlogs')} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: activeTab === 'healthlogs' ? '#e0e0e0' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Health Logs</button></li>
          <li><button onClick={() => setActiveTab('chat')} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: activeTab === 'chat' ? '#e0e0e0' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Chat</button></li>
          <li><button onClick={() => setActiveTab('notifications')} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', background: activeTab === 'notifications' ? '#e0e0e0' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Notifications</button></li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: '2rem' }}>
        {renderTab()}
      </main>
    </div>
  );
};

export default DoctorDashboard;
