// src/DashboardLayout.jsx
import React from 'react';
// import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function DashboardLayout({ children }) {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Navbar isAuthenticated={isAuthenticated} showSidebar={true}>
      {children}
    </Navbar>
  );
}
