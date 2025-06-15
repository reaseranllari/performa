import React from 'react';
import AdminSidebar from '../Components/Admin/AdminSidebar';

const AddUser = () => {
  return (
    <div className="d-flex" style={{ width: '100vw', height: '100vh', backgroundColor: 'white' }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <h3 className="mb-4">Update User</h3>

        <div className="card p-4" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <form>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" placeholder="Enter name" />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter email" />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Enter password" />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" placeholder="Confirm password" />
            </div>

            <div className="mb-3">
              <label className="form-label">User Role</label>
              <select className="form-select">
                <option>-- User Role --</option>
                <option>admin</option>
                <option>manager</option>
                <option>senior employee</option>
                <option>junior employee</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label">Status</label>
              <select className="form-select">
                <option>-- Choose Status --</option>
                <option>enabled</option>
                <option>disabled</option>
              </select>
            </div>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary">← Discard</button>
              <button type="submit" className="btn btn-primary">+ Create New</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
