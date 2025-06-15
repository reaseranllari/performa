import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ManagerGoals = () => {
  const [goals, setGoals] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    employee_id: '',
    deadline: '',
    priority: '',
    status: 'Pending'
  });

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get('http://localhost/login_form/backend/getEmployees.php?manager_id=' + user.id)
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Failed to fetch employees', err));

    fetchGoals();
  }, [user.id]);

  const fetchGoals = () => {
    axios.get('http://localhost/login_form/backend/Manager/getGoals.php?manager_id=' + user.id)
      .then(res => {
        if (Array.isArray(res.data)) {
          setGoals(res.data);
        } else {
          console.error('Invalid response:', res.data);
          setGoals([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch goals', err);
        setGoals([]);
      });
  };

  useEffect(() => {
    const fetchGoals = () => {
      axios.get(`http://localhost/login_form/backend/Manager/getGoals.php?manager_id=${user.id}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setGoals(res.data);
          } else {
            console.error('Invalid response:', res.data);
            setGoals([]);
          }
        })
        .catch(err => {
          console.error('Failed to fetch goals:', err);
          setGoals([]);
        });
    };

    fetchGoals();
  }, [goals]); 

  const handleChange = (e) => {
    setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...newGoal,
      manager_id: user.id
    };

    axios.post('http://localhost/login_form/backend/submitGoal.php', payload)
      .then(res => {
        if (res.data.success) {
          alert('Goal created!');
          fetchGoals();
          setNewGoal({ title: '', description: '', employee_id: '', deadline: '', priority: '', status: 'Pending' });
        } else {
          alert('Goal submission failed: ' + res.data.message);
        }
      })
      .catch(err => {
        console.error('Goal submission failed', err);
        alert('Submission error');
      });
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    axios.post('http://localhost/login_form/backend/Manager/deleteGoal.php', { id: confirmDeleteId })
      .then(res => {
        if (res.data.success) {
          setGoals(goals.filter(g => g.id !== confirmDeleteId));
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
        } else {
          alert('Delete failed: ' + res.data.message);
        }
        setConfirmDeleteId(null);
      })
      .catch(err => {
        console.error('Delete error', err);
        alert('Error deleting goal.');
        setConfirmDeleteId(null);
      });
  };

  const getGoalsPerEmployee = () => {
    const map = {};
    goals?.forEach(g => {
      const name = g.employee || 'Unknown';
      map[name] = (map[name] || 0) + 1;
    });
    return map;
  };


  const getGoalStatusStats = () => {
    const stats = {
        'Completed': 0,
        'In Progress': 0,
        'Pending': 0,
        'Total': goals?.length || 0
    };

    goals?.forEach(goal => {
        if (stats.hasOwnProperty(goal.status)) {
            stats[goal.status]++;
        }
    });

    const total = stats['Total'];
    const percentages = {};
    for (const status in stats) {
        if (status !== 'Total') {
            percentages[status] = total > 0 ? ((stats[status] / total) * 100).toFixed(0) : 0;
        }
    }
    return { counts: stats, percentages: percentages };
  };


  if (!Array.isArray(goals)) {
    return <div className="container mt-4"><h4>Loading or failed to load goals</h4></div>;
  }

  return (
    <div className="container mt-4">
      <h2>Manager Goals</h2>
      {showSuccess && (
        <div className="alert alert-success text-center" role="alert">
          Goal deleted successfully!
        </div>
      )}

{confirmDeleteId !== null && (
  <>
    <div className="modal-backdrop fade show"></div>
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content shadow rounded">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Deletion</h5>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this goal?</p>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}


      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-3">
          <input
            name="title"
            value={newGoal.title}
            onChange={handleChange}
            className="form-control"
            placeholder="Title"
            required
          />
        </div>
        <div className="col-md-3">
          <select
            name="employee_id"
            value={newGoal.employee_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.username} ({emp.role})
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            name="deadline"
            type="date"
            value={newGoal.deadline}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <select
            name="priority"
            value={newGoal.priority}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100">Create</button>
        </div>
      </form>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Employee</th>
            <th>Deadline</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {goals.map(goal => (
    <tr key={goal.id}>
      <td>{goal.title}</td>
      <td>{goal.employee}</td>
      <td>{goal.deadline}</td>
      <td>{goal.priority || '-'}</td>
      <td>{goal.status}</td>
      <td>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDelete(goal.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>

      <div className="row mt-5">
        <div className="col-md-4">
         
          <h5>Goal Status Distribution</h5> 
          <Doughnut
            data={{
              labels: ['Completed', 'In Progress', 'Pending'], 
              datasets: [{
           
                data: [
                    getGoalStatusStats().percentages['Completed'],
                    getGoalStatusStats().percentages['In Progress'],
                    getGoalStatusStats().percentages['Pending']
                ],
                backgroundColor: [
                    '#198754', 
                    '#0d6efd', 
                    '#ffc107'  
                ],
                borderColor: '#ffffff', 
                borderWidth: 2
              }]
            }}
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right', 
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed + '%'; 
                                }
                                return label;
                            }
                        }
                    }
                }
            }}
          />
        
        </div>
        <div className="col-md-4">
          <h5>Goals per Employee</h5>
          <Bar
            data={{
              labels: Object.keys(getGoalsPerEmployee()),
              datasets: [{
                label: 'Goals',
                data: Object.values(getGoalsPerEmployee()),
                backgroundColor: '#0d6efd'
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerGoals;