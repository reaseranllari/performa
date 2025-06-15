import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_id: ''
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setResponseMessage("Passwords do not match.");
      setMessageType("danger");
      return;
    }

    try {
      const res = await fetch("http://localhost/login_form/backend/addUser.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (result.success) {

        window.location.href = "/dashboard/admin/manage-users";
      } else {
        setResponseMessage(result.message);
        setMessageType("danger");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Something went wrong. Please try again.");
      setMessageType("danger");
    }
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100%', backgroundColor: '#fff', zIndex: 0 }}>
      <div className="d-flex" style={{ height: '100%' }}>
        <AdminSidebar />

        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
            <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '500px' }}>
              <div className="card-body p-5">
                <h3 className="text-primary mb-4 fw-bold text-center">Add New User</h3>

                {responseMessage && (
                  <div className={`alert alert-${messageType} text-center`} role="alert">
                    {responseMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ color: '#000' }}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control rounded-pill"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control rounded-pill"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control rounded-pill"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control rounded-pill"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">User Role</label>
                    <select
                      name="role_id"
                      className="form-select rounded-pill"
                      value={formData.role_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Role --</option>
                      <option value="2">Manager</option>
                      <option value="3">Senior Employee</option>
                      <option value="4">Junior Employee</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-secondary rounded-pill"
                      onClick={() => navigate('/dashboard/admin/manage-users')}
                    >
                      ← Discard
                    </button>
                    <button type="submit" className="btn btn-primary rounded-pill">+ Create New</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;

