import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const JuniorGoals = () => {
  const [goals, setGoals] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`http://localhost/login_form/backend/getGoalsByUser.php?user_id=${user.id}`)
        .then((res) => {
          setGoals(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error('Failed to fetch goals:', err);
          setGoals([]);
        });
    }
  }, [user.id]);

  const handleStatusChange = (goalId, newStatus) => {
    axios
      .post('http://localhost/login_form/backend/Senior/updateGoalStatus.php', {
        goal_id: goalId,
        status: newStatus,
        role: 'Junior'
      })
      .then((res) => {
        setGoals((prevGoals) =>
          prevGoals.map((g) =>
            g.id === goalId ? { ...g, status: newStatus } : g
          )
        );


        window.dispatchEvent(new Event('refetchHomeData'));


        axios.get('http://localhost/login_form/backend/Manager/getGoals.php?manager_id=' + user.manager_id)
          .catch((err) => console.error('Failed to notify manager:', err));
      })
      .catch((err) => {
        console.error('Failed to update status', err);
        alert('Could not update status. Please try again.');
      });
  };

  if (!user || !user.id) {
    return (
      <div className="container mt-4">
        <h4 className="text-center">Please log in to view your assigned goals.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Assigned Goals</h3>

      {goals.length === 0 ? (
        <p className="text-center">No goals assigned yet.</p>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => (
                <tr key={goal.id}>
                  <td>{goal.title}</td>
                  <td>
                    <span className={`badge ${goal.priority === 'High' ? 'bg-danger' :
                        goal.priority === 'Medium' ? 'bg-warning text-dark' :
                          'bg-info'
                      }`}>
                      {goal.priority}
                    </span>
                  </td>
                  <td>{goal.deadline}</td>
                  <td>
                    <span className={`badge ${goal.status === 'Completed' ? 'bg-success' :
                        goal.status === 'In Progress' ? 'bg-primary' :
                          'bg-warning text-dark'
                      }`}>
                      {goal.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={goal.status}
                      onChange={(e) =>
                        handleStatusChange(goal.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JuniorGoals;