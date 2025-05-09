import React, { useState } from 'react';
import Appointments from './Appointments';
import Reports from './Reports';
import Vitals from './Vitals';
import Chat from './Chat';
import Notifications from './Notifications';
import Patients from './Patients';
import DashboardLayout from './DashboardLayout';

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
      case 'chat':
        return <Chat doctorView={true} />;
      case 'notifications':
        return <Notifications doctorView={true} />;
      default:
        return null;
    }
  };

  // Render tab selection buttons at the top of the main area
  return (
    <DashboardLayout>
      <div className="mb-4 d-flex flex-wrap gap-2">
        <button className={`btn btn-${activeTab==='appointments'?'primary':'outline-primary'}`} onClick={()=>setActiveTab('appointments')}>Appointments</button>
        <button className={`btn btn-${activeTab==='patients'?'primary':'outline-primary'}`} onClick={()=>setActiveTab('patients')}>Patients</button>
        <button className={`btn btn-${activeTab==='reports'?'primary':'outline-primary'}`} onClick={()=>setActiveTab('reports')}>Reports</button>
        <button className={`btn btn-${activeTab==='vitals'?'primary':'outline-primary'}`} onClick={()=>setActiveTab('vitals')}>Vitals</button>
        <button className={`btn btn-${activeTab==='chat'?'primary':'outline-primary'}`} onClick={()=>setActiveTab('chat')}>Chat</button>
        <button className={`btn btn-${activeTab==='notifications'?'primary':'outline-primary'}`} onClick={()=>setActiveTab('notifications')}>Notifications</button>
      </div>
      {renderTab()}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
