import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role_id: ''
  });

  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    fetch(`http://localhost/login_form/backend/getUsersID.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setFormData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, [id]);

  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost/login_form/backend/editUser.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('User updated successfully!');
          navigate('/dashboard/admin'); 
        } else {
          alert('Failed to update user.');
        }
      })
      .catch(err => {
        console.error("Error updating user:", err);
      });
  };

  if (loading) return <p>Loading user data...</p>;

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3>Edit User</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Role</label>
          <select
            name="role_id"
            className="form-select"
            value={formData.role_id}
            onChange={handleChange}
            required
          >
            <option value="">Select role</option>
            <option value="1">Admin</option>
            <option value="2">Manager</option>
            <option value="3">Employee</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">Save Changes</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/dashboard/admin')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditUser;
