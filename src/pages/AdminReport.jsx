
import React, { useEffect, useState } from 'react';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminReport = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

 
  useEffect(() => {
    setFeedbackData([
      { username: 'john', category: 'Teamwork', rating: 5, comment: 'Great job!', date: '2025-05-01', role: 'manager', anonymous: false },
      { username: 'jane', category: 'Communication', rating: 1.5, comment: 'Needs improvement', date: '2025-05-02', role: 'junior', anonymous: true },
      { username: 'emma', category: 'Punctuality', rating: 4.7, comment: 'Always on time!', date: '2025-05-03', role: 'senior', anonymous: false },
    ]);
  }, []);

  const filteredData = feedbackData.filter(item => {
    return (
      (roleFilter === 'All' || item.role === roleFilter) &&
      (categoryFilter === 'All' || item.category === categoryFilter) &&
      (!dateFilter || item.date === dateFilter)
    );
  });

  const topPerformers = filteredData.filter(f => f.rating >= 4.5);
  const worstPerformers = filteredData.filter(f => f.rating <= 2);

  const trends = filteredData.reduce((acc, item) => {
    const date = item.date;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(trends),
    datasets: [{
      label: 'Feedback Count by Date',
      data: Object.values(trends),
      backgroundColor: 'rgba(75,192,192,0.6)',
    }],
  };

  return (
    <div style={{ minHeight: '150vh', width: '100vw', margin: 0, padding: 0, backgroundColor: 'white' }}>
      <div className="d-flex">
        <div className="sidebar-fixed">
          <AdminSidebar />
        </div>

        <div className="content-area" style={{ marginLeft: '250px', padding: '2rem', maxWidth: '1100px', width: '100%' }}>
          <h2 className="mb-4 fw-bold">Admin Reports</h2>

       
          <div className="row mb-4">
            <div className="col-md-3">
              <label className="form-label">Filter by Role</label>
              <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option>All</option>
                <option>manager</option>
                <option>senior</option>
                <option>junior</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Filter by Category</label>
              <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option>All</option>
                <option>Teamwork</option>
                <option>Communication</option>
                <option>Punctuality</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Filter by Date</label>
              <input type="date" className="form-control" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
            </div>
          </div>

         
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5>Total Feedbacks: {filteredData.length}</h5>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5>Top Performers</h5>
                  <ul>
                    {topPerformers.map((f, i) => <li key={i}>{f.username} ({f.rating})</li>)}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5>Worst Performers</h5>
                  <ul>
                    {worstPerformers.map((f, i) => <li key={i}>{f.username} ({f.rating})</li>)}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-12 mb-4">
              <div className="card">
                <div className="card-body" style={{ height: '300px' }}>
                  <h5>Feedback Trends</h5>
                  <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            
            <div className="col-md-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5>Anonymous Feedback Overview</h5>
                  <ul>
                    {filteredData.filter(f => f.anonymous).map((f, i) => (
                      <li key={i}>{f.comment} ({f.date})</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          
            <div className="col-md-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5>Goal Progress</h5>
                  <p>This section will later display goal achievement percentages.</p>
                </div>
              </div>
            </div>

           
            <div className="col-md-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5>Feedback Management</h5>
                  {filteredData.map((f, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center border-bottom py-2">
                      <span>{f.username} - {f.comment} ({f.rating})</span>
                      <div>
                        <button className="btn btn-outline-secondary btn-sm me-2">Archive</button>
                        <button className="btn btn-outline-danger btn-sm">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReport;

