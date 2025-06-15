import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';


const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', margin: 0, padding: 0 }}>
      <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: '250px', zIndex: 1000 }}>
        <AdminSidebar />
      </div>

      <div
        className="container-fluid p-4 text-start"
        style={{
          marginLeft: '250px',
          flex: 1,
          color: 'black',
          backgroundColor: 'white',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
      
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
