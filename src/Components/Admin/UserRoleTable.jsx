import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const UserRoleTable = () => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch("http://localhost/login_form/backend/get_users.php")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Failed to fetch users:", err));
  }, []);

  const confirmDeleteUser = () => {
    if (!userToDelete) return;

    fetch('http://localhost/login_form/backend/deleteUser.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userToDelete.id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUsers(users.filter(user => user.id !== userToDelete.id));
          setSuccessMessage(`User "${userToDelete.username}" deleted successfully.`);
        } else {
          setSuccessMessage(' Failed to delete user.');
        }
        setShowDeleteModal(false);
        setUserToDelete(null);
      })
      .catch(err => {
        console.error("Delete error:", err);
        setSuccessMessage(' An error occurred during deletion.');
        setShowDeleteModal(false);
      });
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>User Overview</h2>
        <Link to="/dashboard/admin/add-user" className="btn btn-primary">+ Add New</Link>
      </div>


      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

   
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Date Joined</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No users found.</td>
            </tr>
          ) : (
            filteredUsers.map((u, index) => (
              <tr key={u.id}>
                <td>{index + 1}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td><span className="badge bg-primary">{u.role}</span></td>
                <td>{new Date(u.created_at).toLocaleString()}</td>
                <td>
                  {(u.id === currentUser.id && u.role === 'admin') ? (
                    <span className="text-muted">Admin account</span>
                  ) : (
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={() => handleEdit(u)} title="Edit user">
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => { setUserToDelete(u); setShowDeleteModal(true); }} title="Delete user">
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  )}

                  
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      
      {showEditModal && editUser && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetch('http://localhost/login_form/backend/editUser.php', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editUser)
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        if (data.success) {
                          setSuccessMessage(' User updated successfully.');
                          setShowEditModal(false);
                          setUsers((prev) =>
                            prev.map((u) => (u.id === editUser.id ? editUser : u))
                          );
                        } else {
                          setSuccessMessage(' Failed to update user.');
                        }
                      });
                  }}
                >
                  <div className="mb-3">
                    <label>Username</label>
                    <input
                      className="form-control"
                      value={editUser.username}
                      onChange={(e) =>
                        setEditUser({ ...editUser, username: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      className="form-control"
                      type="email"
                      value={editUser.email}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Role</label>
                    <select
                      className="form-select"
                      value={editUser.role_id}
                      onChange={(e) =>
                        setEditUser({ ...editUser, role_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Select role</option>
                      <option value="2">Manager</option>
                      <option value="3">Senior Employee</option>
                      <option value="4">Junior Employee</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-success">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {showDeleteModal && userToDelete && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete <strong>{userToDelete.username}</strong>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDeleteUser}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleTable;
