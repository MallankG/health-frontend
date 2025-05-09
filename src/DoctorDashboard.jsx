import React from 'react';
import Patients from './Patients';

const DoctorDashboard = () => {
  return (
    <Patients doctorView={true} />
  );
};

export default DoctorDashboard;
