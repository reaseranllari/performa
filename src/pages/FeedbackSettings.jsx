import React from 'react';
import AdminSidebar from '../Components/Admin/AdminSidebar';

const FeedbackSettings = () => {
  return (
    <div style={{ minHeight: '150vh', width: '100vw', margin: 0, padding: 0, backgroundColor: 'white' }}>
      <div className="d-flex" style={{ height: '100vh' }}>
        <AdminSidebar />

        <div className="container-fluid p-4 bg-white" style={{ marginLeft: '250px', minHeight: '100vh' }}>

          <h2 className="mb-4">Feedback Settings</h2>

          <div className="row mb-4">
 
  <div className="col-md-6">
    <div className="card h-100">
      <div className="card-header">Feedback Categories</div>
      <div className="card-body">
        <ul className="list-group mb-3">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Communication
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2">Edit</button>
              <button className="btn btn-sm btn-outline-danger">Delete</button>
            </div>
          </li>
        </ul>
        <div className="input-group">
          <input type="text" className="form-control" placeholder="Add new category..." />
          <button className="btn btn-primary">Add</button>
        </div>
      </div>
    </div>
  </div>

  {/* Feedback Frequency */}
  <div className="col-md-6">
    <div className="card h-100">
      <div className="card-header">Feedback Frequency</div>
      <div className="card-body">
        <select className="form-select mb-3">
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="enableReminders" />
          <label className="form-check-label" htmlFor="enableReminders">
            Send reminder emails
          </label>
        </div>
      </div>
    </div>
  </div>
</div>


          
          <div className="card mb-4">
            <div className="card-header">Who Can Give Feedback</div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Allowed?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Manager</td>
                    <td>Senior Employee</td>
                    <td><input type="checkbox" defaultChecked /></td>
                  </tr>
                  <tr>
                    <td>Senior Employee</td>
                    <td>Junior Employee</td>
                    <td><input type="checkbox" defaultChecked /></td>
                  </tr>
                  <tr>
                    <td>Junior Employee</td>
                    <td>Manager</td>
                    <td><input type="checkbox" disabled /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="row mb-4">
 
  <div className="col-md-6">
    <div className="card h-100">
      <div className="card-header">Feedback Form Options</div>
      <div className="card-body">
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" id="enableStars" defaultChecked />
          <label className="form-check-label" htmlFor="enableStars">
            Enable star rating
          </label>
        </div>
        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" id="enableComments" defaultChecked />
          <label className="form-check-label" htmlFor="enableComments">
            Enable comment box
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="allowAnonymous" />
          <label className="form-check-label" htmlFor="allowAnonymous">
            Allow anonymous feedback
          </label>
        </div>
      </div>
    </div>
  </div>

 
  <div className="col-md-6">
    <div className="card h-100">
      <div className="card-header">Feedback Management</div>
      <div className="card-body d-flex flex-column gap-2">
  <button className="btn btn-warning btn-sm px-3">Archive Old Feedback</button>
  <button className="btn btn-danger btn-sm px-3">Reset Feedback Cycle</button>
</div>

    </div>
  </div>
</div>

          
          <div className="text-end">
            <button className="btn btn-success px-4">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSettings;
