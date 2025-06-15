import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaStar, FaBullseye, FaSignOutAlt, FaBook } from 'react-icons/fa';

const SeniorSidebar = () => {
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
        <h4 className="mb-4 fw-bold">Performa</h4>

      
        <ul className="nav flex-column mb-4" style={{ alignItems: 'flex-start' }}>
          <li className="nav-item w-100">
            <NavLink
              to="home"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${isActive ? 'text-primary fw-bold' : 'text-white'}`
              }
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <FaHome className="me-2" /> Home
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink
              to="feedback"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${isActive ? 'text-primary fw-bold' : 'text-white'}`
              }
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <FaStar className="me-2" /> Feedback
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink
              to="goals"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${isActive ? 'text-primary fw-bold' : 'text-white'}`
              }
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <FaBullseye className="me-2" /> Goals
            </NavLink>
          </li>
          <li className="nav-item w-100">
            <NavLink
              to="notes"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${isActive ? 'text-primary fw-bold' : 'text-white'}`
              }
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              <FaBook className="me-2" /> Notes
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

export default SeniorSidebar;