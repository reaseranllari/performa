import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaHome, FaStar, FaSignOutAlt, FaBullseye, FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const JuniorSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };


  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark position-fixed"
      style={{ width: '250px', height: '100vh', top: 0, left: 0 }}
    >
   <div className="text-center">
  <span className="fs-4 fw-bold mb-4 d-block">Performa</span>
</div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/dashboard/junioremployee"
            end
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? 'active text-white bg-dark' : 'text-white bg-dark'}`
            }
          >
            <FaHome className="me-2" /> Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/junioremployee/feedback"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? 'active text-white bg-dark' : 'text-white bg-dark'}`
            }
          >
            <FaStar className="me-2" /> Feedback
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/junioremployee/goals"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? 'active text-white bg-dark' : 'text-white bg-dark'}`
            }
          >
            <FaBullseye className="me-2" /> Goals
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/junioremployee/notes"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? 'active text-white bg-dark' : 'text-white bg-dark'}`
            }
          >
            <FaBook className="me-2" /> Notes
          </NavLink>
        </li>
      </ul>

      <button
        onClick={handleLogout}
        className="btn btn-outline-light mt-auto w-100 d-flex align-items-center justify-content-center"
      >
        <FaSignOutAlt className="me-2" /> Log out
      </button>
    </div>
  );
};

export default JuniorSidebar;