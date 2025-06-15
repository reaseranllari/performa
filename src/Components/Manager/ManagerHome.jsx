import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ManagerHome = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [feedbackStats, setFeedbackStats] = useState({ feedback_count: 0, avg_rating: 0 });
  const [topLow, setTopLow] = useState({ top: '-', low: '-' });
  const [performanceChart, setPerformanceChart] = useState({ labels: [], datasets: [] });
  const [recentFeedback, setRecentFeedback] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user?.id) return;
  
    fetch(`http://localhost/login_form/backend/getEmployeeCount.php?manager_id=${user.id}`)
      .then(res => res.json())
      .then(data => setEmployeeCount(data.total || 0));
  
    fetch(`http://localhost/login_form/backend/Manager/getManagerReports.php?manager_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        const allFeedbacks = data.feedbacks || [];
  
        const now = new Date();
        const feedbacksThisMonth = allFeedbacks.filter(fb => {
          const d = new Date(fb.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
  
       
        const feedbackWithAvg = allFeedbacks.map(fb => {
          const entries = fb.sub_categories?.split(',') || [];
          const ratings = entries.map(entry => parseFloat(entry.split(':')[1])).filter(r => !isNaN(r));
          const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
          return { ...fb, avg_rating: avgRating };
        });
  
        
        const allRatings = feedbackWithAvg.map(f => f.avg_rating).filter(r => !isNaN(r));
        const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2) : '0';
  
      
        const avgByUser = {};
        const countByUser = {};
        const nameMap = {}; 
        
        feedbackWithAvg.forEach(f => {
          const id = f.to_user_id;
          const name = f.name || 'Unnamed';
          nameMap[id] = name;
        
          avgByUser[id] = (avgByUser[id] || 0) + f.avg_rating;
          countByUser[id] = (countByUser[id] || 0) + 1;
        });
        
        const avgFinal = Object.entries(avgByUser).map(([id, total]) => ({
          name: nameMap[id],
          avg: total / countByUser[id]
        })).sort((a, b) => b.avg - a.avg);
        
        const top = avgFinal[0]?.name || '-';
        const low = avgFinal.length > 1 ? avgFinal[avgFinal.length - 1]?.name : '-';
        
        setTopLow({ top, low });


console.log("Final sorted averages:", avgFinal);

  
const sorted = [...allFeedbacks].sort((a, b) => new Date(b.date) - new Date(a.date));


const seen = new Set();
const recent = [];

for (const fb of sorted) {
  const userId = fb.to_user_id;
  if (!seen.has(userId)) {
    seen.add(userId);

    
    const entries = fb.sub_categories?.split(',') || [];
    const ratings = entries.map(entry => parseFloat(entry.split(':')[1])).filter(r => !isNaN(r));
    const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    recent.push({
      to_username: fb.name || 'Unnamed',
      avg_rating: avg,
      date: fb.date,
      comment: fb.comment || '',
      evaluate_more: fb.evaluate_more || '',
      evaluate_less: fb.evaluate_less || ''
    });
  }

  if (recent.length === 5) break;
}
  
       
        const ratingsBySubcategory = {};
        const counts = {};
        feedbackWithAvg.forEach(fb => {
          const subCats = fb.sub_categories?.split(',') || [];
          subCats.forEach(entry => {
            const [sub, rating] = entry.split(':');
            const s = sub.trim();
            const r = parseFloat(rating);
            if (!isNaN(r)) {
              ratingsBySubcategory[s] = (ratingsBySubcategory[s] || 0) + r;
              counts[s] = (counts[s] || 0) + 1;
            }
          });
        });
  
        const labels = Object.keys(ratingsBySubcategory);
        const ratings = labels.map(label => (ratingsBySubcategory[label] / counts[label]).toFixed(2));
  
        setFeedbackStats({
          feedback_count: feedbacksThisMonth.length,
          avg_rating: avgRating
        });
  
       


        setRecentFeedback(recent);
        setPerformanceChart({
          labels,
          datasets: [{
            label: 'Average Rating',
            data: ratings,
            backgroundColor: '#0d6efd'
          }]
        });
      })
      .catch(err => console.error('Failed to fetch manager report data:', err));
  }, [user?.id]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <div>
      <h2 className="mb-2">Welcome, {user?.username || 'Manager'}!</h2>
      

      <h4 className="mt-4 mb-3">Dashboard Overview</h4>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Employees</h5>
              <p className="card-text fs-4">{employeeCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Feedback Given</h5>
              <p className="card-text fs-4">{feedbackStats.feedback_count} this month</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Avg. Rating</h5>
              <p className="card-text fs-4">{feedbackStats.avg_rating}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Top Performer</h5>
              <p className="card-text fs-5">{topLow.top}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Lowest Performer</h5>
              <p className="card-text fs-5">{topLow.low}</p>
            </div>
          </div>
        </div>
      </div>

      <h5 className="mb-3">Quick Actions</h5>
      <div className="d-flex flex-wrap gap-3 mb-4">
        <a href="/dashboard/manager/feedback" className="btn btn-outline-primary">Give Feedback</a>
        <a href="/dashboard/manager/goals" className="btn btn-outline-secondary">Set Goals</a>
        <a href="/dashboard/manager/reports" className="btn btn-outline-dark">View Reports</a>
      </div>

      <h5 className="mb-3">Recent Feedback</h5>
<ul className="list-group mb-5">
  {recentFeedback.length === 0 ? (
    <li className="list-group-item text-muted">No recent feedback found.</li>
  ) : (
    recentFeedback.map((fb, idx) => (
      <li key={idx} className="list-group-item">
        <div className="d-flex justify-content-between align-items-center">
          <strong>{fb.to_username}</strong>
          <span className="fw-bold text-warning">⭐ {fb.avg_rating.toFixed(2)}</span>
        </div>
        <div className="small text-muted">{new Date(fb.date).toLocaleDateString()}</div>
        {fb.comment && <div><em>{fb.comment}</em></div>}
        {(fb.evaluate_more || fb.evaluate_less) && (
          <div className="small">
            <span className="text-success">+ {fb.evaluate_more}</span>
            {" / "}
            <span className="text-danger">– {fb.evaluate_less}</span>
          </div>
        )}
      </li>
    ))
  )}
</ul>


      <h5 className="mb-3">Team Performance by Category</h5>
      <div className="card p-3 mb-5" style={{ height: '400px' }}>
        <Bar
          key={performanceChart.labels.join(',')}
          data={performanceChart}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default ManagerHome;