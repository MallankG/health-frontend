import React, { useState } from 'react';
import Appointments from './Appointments';
import Reports from './Reports';
import Vitals from './Vitals';
import Chat from './Chat';
import Notifications from './Notifications';
import Patients from './Patients';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('patients');

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

  // Render the active tab content
  return (
    <>
      {renderTab()}
    </>
  );
};

export default DoctorDashboard;
