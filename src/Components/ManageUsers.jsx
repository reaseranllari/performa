import React, { useEffect, useState } from 'react';
import AdminSidebar from './Admin/AdminSidebar';
import { Link } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost/backend/get_users.php')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Failed to load users:", err));
  }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: 'white', margin: 0, padding: 0 }}>
      
  
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '250px',
          zIndex: 1000,
          backgroundColor: '#212529',
        }}
      >
        <AdminSidebar />
      </div>

  
      <div
        style={{
          marginLeft: '250px',
          flexGrow: 1,
          padding: '2rem',
          backgroundColor: 'white',
          minHeight: '100vh',
        }}
      >
        <h2 className="mb-4">Manage Users</h2>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            placeholder="Search..."
            className="form-control w-50"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Link to="/dashboard/admin/add-user" className="btn btn-primary">+ Add New</Link>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped w-100">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>User Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
