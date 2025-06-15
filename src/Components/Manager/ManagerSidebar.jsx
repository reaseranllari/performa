import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaStar, FaBullseye, FaChartBar, FaSignOutAlt } from 'react-icons/fa';

const ManagerSidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  //const isActivePath = (basePath) => location.pathname.startsWith(basePath);

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark position-fixed"
      style={{ width: '250px', height: '100vh', top: 0, left: 0, overflowY: 'auto' }}
    >
      <span className="fs-4 mb-4 fw-bold text-center d-flex justify-content-center align-items-center">Performa</span>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/dashboard/manager/home"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? 'active text-white bg-dark' : 'text-white bg-dark'}`
            }
          >
            <FaHome className="me-2" /> Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/manager/feedback"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? 'active text-white bg-dark' : 'text-white bg-dark'}`
            }
          >
            <FaStar className="me-2" /> Feedback
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/manager/goals"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? 'active text-white bg-primary' : 'text-white'}`
            }
          >
            <FaBullseye className="me-2" /> Goals
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/manager/reports"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? 'active text-white bg-primary' : 'text-white'}`
            }
          >
            <FaChartBar className="me-2" /> Reports
          </NavLink>
        </li>
      </ul>

      <button
        onClick={handleLogout}
        className="btn btn-outline-light mt-auto w-100 d-flex align-items-center justify-content-center"
        style={{ position: 'sticky', bottom: '0' }}
      >
        <FaSignOutAlt className="me-2" /> Log out
      </button>
    </div>
  );
};

export default ManagerSidebar;
