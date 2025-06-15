import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const JuniorHome = () => {
  const [goals, setGoals] = useState([]);
  const [perfCat, setPerfCat] = useState([]);
  const [perfMonth, setPerfMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  console.log("DEBUG: User from localStorage:", user);

  const allCategories = [
    "Communication", "Teamwork", "Adaptability", "Problem-Solving",
    "Reliability", "Accountability", "Punctuality", "Work Ethic",
    "Initiative", "Leadership", "Decision Making", "Delegation"
  ];

  useEffect(() => {
    if (!user || !user.id) {
      setError("User not logged in or missing ID.");
      setLoading(false);
      return;
    }

    const fetchGoals = axios.get(`http://localhost/login_form/backend/getGoalsByUser.php?user_id=${user.id}`);
    const fetchFeedback = axios.get(`http://localhost/login_form/backend/Junior/getFeedbackSummaryJr.php?junior_id=${user.id}`);

    Promise.all([fetchGoals, fetchFeedback])
      .then(([goalsRes, feedbackRes]) => {
        setGoals(Array.isArray(goalsRes.data) ? goalsRes.data : []);
        setPerfCat(feedbackRes.data.byCategory || []);
        setPerfMonth(feedbackRes.data.byMonth || []);
        console.log("Ratings by category:", feedbackRes.data.byCategory); 
        console.log("AllCategories:", allCategories); 
        console.log("Received categories from backend:", perfCat.map(c => c.category)); 
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      });
  }, []);

 

  const refreshGoals = () => {
    axios.get(`http://localhost/login_form/backend/getGoalsByUser.php?user_id=${user.id}`)
      .then(res => setGoals(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Failed to refresh goals:', err));
  };

  const handleGoalStatusChange = (goalId, newStatus) => {
    axios.post('http://localhost/login_form/backend/updateGoalsStatus.php', {
      goal_id: goalId,
      status: newStatus,
      role: 'Junior'
    })
    .then(res => {
      if (res.data.success) {
        refreshGoals(); 
      } else {
        console.error('Update failed:', res.data.message);
      }
    })
    .catch(err => console.error('API Error:', err));
  };

  if (loading) return <div className="mt-4 text-center">Loading dashboard...</div>;
  if (error) return <div className="mt-4 text-danger text-center">{error}</div>;

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const inProg = goals.filter(g => g.status === 'In Progress').length;
  const pending = goals.filter(g => g.status === 'Pending').length;

  const doughnutData = {
    labels: ['Completed', 'In Progress', 'Pending'],
    datasets: [{
      data: [completedGoals, inProg, pending],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
      borderWidth: 1
    }]
  };

  return (
    <div className="mt-4 mb-5">
      <h2>Welcome, {user.username}!</h2>

     
      <div className="d-flex gap-3 mb-4">
        <div className="card text-white bg-primary flex-fill">
          <div className="card-body">
            <h5>Total Goals</h5>
            <p className="fs-2">{totalGoals}</p>
          </div>
        </div>
        <div className="card text-white bg-success flex-fill">
          <div className="card-body">
            <h5>Completed</h5>
            <p className="fs-2">{completedGoals}</p>
          </div>
        </div>
        <div className="card text-white bg-warning flex-fill">
          <div className="card-body">
            <h5>In Progress</h5>
            <p className="fs-2">{inProg}</p>
          </div>
        </div>
        <div className="card text-white bg-danger flex-fill">
          <div className="card-body">
            <h5>Pending</h5>
            <p className="fs-2">{pending}</p>
          </div>
        </div>
      </div>


      <div className="card p-3 mb-5" style={{ height: '350px' }}>
        <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
      </div>

    
      <h4 className="mt-5 mb-3">Performance Summary</h4>

      <div className="card p-3 mb-5" style={{ height: '400px' }}>
        <h5 className="card-title text-center mb-3">Average Ratings by Category</h5>
        <Bar
          data={{
            labels: perfCat.map(d => d.category),
            datasets: [{
              label: 'Avg Rating',
              data: perfCat.map(d => d.avg_rating),
              backgroundColor: '#0d6efd'
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 5 } }
          }}
        />
      </div>

      <div className="card p-3 mb-5" style={{ height: '400px' }}>
        <h5 className="card-title text-center mb-3">Feedback Received by Month</h5>
        <Bar
  data={{
    labels: perfMonth.map(d => d.month),
    datasets: [{
      label: 'Feedback Count',
      data: perfMonth.map(d => Number(d.count)),
      backgroundColor: '#007bff'
      
    }]
  }}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    }
  }}
/>

      </div>
    </div>
  );
};

export default JuniorHome;
