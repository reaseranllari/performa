import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUsers, FaSignOutAlt } from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
  
      <div
        style={{
          width: '250px',
          backgroundColor: '#1c1c1c',
          color: 'white',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          overflowY: 'auto',
          zIndex: 1000
        }}
      >
        <h4 className="mb-4 fw-bold" style={{ textAlign: 'center', fontSize: '1.5rem' }}>Performa</h4>

       
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <NavLink
              to="/dashboard/admin/manage-users"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${isActive ? 'active text-white bg-dark' : 'text-white bg-dark'}`
              }
            >
              <FaUsers className="me-2" /> Manage Users
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/dashboard/admin/reports"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${isActive ? 'active text-white bg-dark' : 'text-white bg-dark'}`
              }
            >
              Reports
            </NavLink>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="btn btn-outline-light mt-auto w-100"
          style={{ position: 'sticky', bottom: '0' }}
        >
          <FaSignOutAlt className="me-2" /> Log out
        </button>
      </div>

      
      <div
        style={{
          flexGrow: 1,
          padding: '20px',
          backgroundColor: '#ffffff',
          marginLeft: '5px',
          minHeight: '100vh',
          overflowX: 'auto'
        }}
      >
       
      </div>
    </div>
  );
};

export default AdminSidebar;
