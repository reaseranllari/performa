import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SeniorSidebar from './SeniorSidebar';

const SeniorDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        overflowX: 'hidden'
      }}
    >
      
      <SeniorSidebar />

     
      <div
        style={{
          marginLeft: '250px',
          width: 'calc(100vw - 250px)',
          padding: '30px',
          minHeight: '100vh',
          overflowX: 'auto'
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default SeniorDashboard;
