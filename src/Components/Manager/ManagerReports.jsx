import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, TimeScale
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { Form, Table } from 'react-bootstrap';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, TimeScale
);

const ManagerReports = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [normalizedFeedbacks, setNormalizedFeedbacks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState({ employee: '', category: '', role: '', from: '', to: '' });
  const [feedbackToManager, setFeedbackToManager] = useState([]);

  const [feedbackGivenToMe, setFeedbackGivenToMe] = useState([]);
  const [loadingFeedbackToMe, setLoadingFeedbackToMe] = useState(true);
  const [errorFeedbackToMe, setErrorFeedbackToMe] = useState(null);

  const subCategoryToMain = {
    Communication: 'Performance',
    Teamwork: 'Performance',
    Adaptability: 'Performance',
    'Problem-solving': 'Performance',
    Reliability: 'Performance',
    Accountability: 'Performance',
    Punctuality: 'Professionalism',
    'Work Ethic': 'Professionalism',
    Initiative: 'Professionalism',
    Leadership: 'Leadership',
    'Decision Making': 'Leadership',
    Delegation: 'Leadership'
  };

  const roleMapping = {
    3: 'senior',
    4: 'junior'
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    axios.get(`http://localhost/login_form/backend/Manager/getManagerReports.php?manager_id=${user.id}`)
      .then(res => {
        const data = res.data.feedbacks || [];
        setFeedbacks(data);
        setFeedbackToManager(res.data.feedbackToManager || []);

        const expanded = data.flatMap(fb => {
          const subCats = typeof fb.sub_categories === 'string' ? fb.sub_categories.split(',') : [];
          return subCats.map(subEntry => {
            const [subCategory, rating] = subEntry.split(':');
            return {
              ...fb,
              subCategory: subCategory.trim(),
              rating: parseFloat(rating),
              mainCategory: subCategoryToMain[subCategory.trim()] || 'Unknown',
              role: fb.role
            };
          });
        });


        setNormalizedFeedbacks(expanded);
        console.log("Raw feedbacks:", data);
        console.log("Normalized feedbacks:", expanded);
      })
      .catch(err => console.error("Failed to fetch feedback data", err));

    axios.get(`http://localhost/login_form/backend/getEmployees.php?manager_id=${user.id}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setEmployees(res.data);
        }
      })
      .catch(err => console.error("Failed to fetch employees", err));

    const fetchFeedbackGivenToMe = async () => {
      if (!user || user.role !== 'manager' || !user.id) {

        setErrorFeedbackToMe("Not authorized to view this feedback or user data is missing.");
        setLoadingFeedbackToMe(false);
        return;
      }

      try {
        setLoadingFeedbackToMe(true);

        const response = await axios.get(`http://localhost/login_form/backend/Manager/getFeedbackGivenToMe.php?manager_id=${user.id}`);
        if (response.data.success) {
          setFeedbackGivenToMe(response.data.feedback);
        } else {
          setErrorFeedbackToMe(response.data.error || "Failed to fetch feedback given to you.");
        }
      } catch (err) {
        console.error("Error fetching feedback given to manager:", err);
        setErrorFeedbackToMe("Could not load feedback given to you. Please try again.");
      } finally {
        setLoadingFeedbackToMe(false);
      }
    };

    fetchFeedbackGivenToMe();

  }, []);



  const filteredFeedbacks = normalizedFeedbacks.filter(fb => {


    const roleName = roleMapping[fb.role] || '';

    console.log('Filtering:', {
      name: fb.name,
      role: fb.role,
      roleName,
      filterRole: filter.role
    });

    const hasSelectedAllFilters = filter.employee && filter.category && filter.role;
    if (!hasSelectedAllFilters) return false;

    return (
      fb.name.toLowerCase().includes(filter.employee.toLowerCase()) &&
      fb.mainCategory === filter.category &&
      roleName === filter.role.toLowerCase() &&
      (!filter.from || new Date(fb.date) >= new Date(filter.from)) &&
      (!filter.to || new Date(fb.date) <= new Date(filter.to))
    );
  });
  console.log("Filtered feedbacks:", filteredFeedbacks);


  const categoryCounts = filteredFeedbacks.reduce((acc, cur) => {
    acc[cur.subCategory] = (acc[cur.subCategory] || 0) + 1;
    return acc;
  }, {});

  const avgSubRatings = {};
  const subCounts = {};

  filteredFeedbacks.forEach(fb => {
    if (!avgSubRatings[fb.subCategory]) {
      avgSubRatings[fb.subCategory] = 0;
      subCounts[fb.subCategory] = 0;
    }
    avgSubRatings[fb.subCategory] += fb.rating;
    subCounts[fb.subCategory] += 1;
  });

  Object.keys(avgSubRatings).forEach(sub => {
    if (subCounts[sub] > 0) {
      avgSubRatings[sub] = parseFloat((avgSubRatings[sub] / subCounts[sub]).toFixed(2));
    } else {
      avgSubRatings[sub] = 0;
    }
  });
  console.log("avgSubRatings", avgSubRatings);


  const dates = {};
  filteredFeedbacks.forEach(fb => {
    dates[fb.date] = (dates[fb.date] || 0) + 1;
  });

  const hasData = filteredFeedbacks.length > 0;
  const flagged = filteredFeedbacks.filter(f => f.rating <= 2);
  const mainCategories = ['Performance', 'Professionalism', 'Leadership'];

  const avgRatings = {};
  const counts = {};
  filteredFeedbacks.forEach(fb => {
    avgRatings[fb.name] = (avgRatings[fb.name] || 0) + fb.rating;
    counts[fb.name] = (counts[fb.name] || 0) + 1;
  });
  Object.keys(avgRatings).forEach(name => {
    if (counts[name] > 0) {
      avgRatings[name] = parseFloat((avgRatings[name] / counts[name]).toFixed(2));
    } else {
      avgRatings[name] = 0;
    }
  });
  console.log("avgRatings", avgRatings);


  return (
    <div className="container mt-4">
      <h2>Manager Feedback Reports</h2>


      <Form className="row g-3 mb-4">

        <Form.Group className="col-md-2">
          <Form.Label>Employee</Form.Label>
          <Form.Select value={filter.employee} onChange={e => setFilter({ ...filter, employee: e.target.value })}>
            <option value="">All</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.username}>{emp.username}</option>
            ))}
          </Form.Select>
        </Form.Group>


        <Form.Group className="col-md-2">
          <Form.Label>Main Category</Form.Label>
          <Form.Select value={filter.category} onChange={e => setFilter({ ...filter, category: e.target.value })}>
            <option value="">All</option>
            {mainCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Form.Group>


        <Form.Group className="col-md-2">
          <Form.Label>Role</Form.Label>
          <Form.Select value={filter.role} onChange={e => setFilter({ ...filter, role: e.target.value })}>
            <option value="">All</option>
            <option value="senior">Senior</option>
            <option value="junior">Junior</option>
          </Form.Select>
        </Form.Group>


        <Form.Group className="col-md-2">
          <Form.Label>From</Form.Label>
          <Form.Control type="date" value={filter.from} onChange={e => setFilter({ ...filter, from: e.target.value })} />
        </Form.Group>

        <Form.Group className="col-md-2">
          <Form.Label>To</Form.Label>
          <Form.Control type="date" value={filter.to} onChange={e => setFilter({ ...filter, to: e.target.value })} />
        </Form.Group>
      </Form>

      <CSVLink
        data={filteredFeedbacks.map(fb => ({
          Employee: fb.name,
          Role: roleMapping[fb.role] || '',
          "Main Category": fb.mainCategory,
          Subcategory: fb.subCategory,
          Rating: fb.rating,
          Comment: fb.comment,
          "Evaluate More": fb.evaluate_more,
          "Evaluate Less": fb.evaluate_less,
          Date: fb.date
        }))}
        filename={"feedback-report.csv"}
        className="btn btn-outline-success mb-4"
      >
        Export CSV
      </CSVLink>
      <CSVLink
        data={[
          ...Object.entries(categoryCounts).map(([label, val]) => ({
            Section: 'Feedback Count per Subcategory',
            Type: 'Subcategory',
            Label: label,
            Value: val
          })),
          ...Object.entries(avgSubRatings).map(([label, val]) => ({
            Section: 'Average Rating per Subcategory',
            Type: 'Subcategory',
            Label: label,
            Value: val
          })),
          ...Object.entries(avgRatings).map(([label, val]) => ({
            Section: 'Average Rating per Employee',
            Type: 'Employee',
            Label: label,
            Value: val
          })),
          ...Object.entries(dates).map(([label, val]) => ({
            Section: 'Feedback Trends',
            Type: 'Date',
            Label: label,
            Value: val
          })),
        ]}
        filename={`feedback-summary-${new Date().toISOString().split('T')[0]}.csv`}
        className="btn btn-outline-primary mb-4 ms-3"
      >
        Export Summary CSV
      </CSVLink>




      <div className="row">
        <div className="col-md-4">
          <h5>Feedback Count per Subcategory</h5>
          {hasData ? (
            <Doughnut data={{
              labels: Object.keys(categoryCounts),
              datasets: [{
                data: Object.values(categoryCounts),
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#fd7e14', '#6f42c1', '#20c997', '#e83e8c', '#6610f2']
              }]
            }} />
          ) : (
            <p className="text-muted text-center mt-4">No feedback data available for selected filters.</p>
          )}
        </div>

        <div className="col-md-4">
          <h5>Avg Rating Per Employee</h5>
          <Bar data={{
            labels: Object.keys(avgRatings),
            datasets: [{
              label: 'Average Rating',
              data: Object.values(avgRatings),
              backgroundColor: '#17a2b8'
            }]
          }} />
        </div>

        <div className="col-md-4">
          <h5>Feedback Trends</h5>
          <Line data={{
            labels: Object.keys(dates),
            datasets: [{
              label: 'Feedback Count',
              data: Object.values(dates),
              borderColor: '#6f42c1',
              fill: false
            }]
          }} />
        </div>

        <div className="col-md-4">
          <h5>Avg Rating Per Subcategory</h5>
          {hasData ? (
            <Bar data={{
              labels: Object.keys(avgSubRatings),
              datasets: [{
                label: 'Average Rating',
                data: Object.values(avgSubRatings),
                backgroundColor: '#f67599'
              }]
            }} />
          ) : (
            <p className="text-muted text-center mt-4">No subcategory average data.</p>
          )}
        </div>
      </div>

      <hr />


      <h5 className="mt-4">Flagged Feedback (Rating ≤ 2)</h5>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Main Category</th>
            <th>Subcategory</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {flagged.map((f, idx) => (
            <tr key={idx}>
              <td>{f.name}</td>
              <td>{f.mainCategory}</td>
              <td>{f.subCategory}</td>
              <td>{f.rating}</td>
              <td>{f.comment}</td>
              <td>{f.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>



      <h4 className="mt-5">Feedback Given to You</h4>
      {loadingFeedbackToMe ? (
        <p className="text-muted text-center mt-4">Loading feedback given to you...</p>
      ) : errorFeedbackToMe ? (
        <div className="alert alert-danger text-center mt-4">{errorFeedbackToMe}</div>
      ) : feedbackGivenToMe.length > 0 ? (
        <Table className="table table-bordered table-hover mt-2">
          <thead className="table-secondary">
            <tr>
              <th>From</th>
              <th>Category (Rating)</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbackGivenToMe.map((fb) => (

              <tr key={fb.submission_id}>
                <td>{fb.from_username}</td>
                <td>

                  {fb.ratings.map((item, idx) => (
                    <span key={idx} className="badge bg-info text-dark me-1 mb-1">
                      {item.category} ({item.rating})
                    </span>
                  ))}

                  {fb.ratings.length === 0 && <span className="text-muted">No specific ratings</span>}
                </td>
                <td>{fb.comment}</td>
                <td>{fb.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-muted text-center mt-4">No feedback has been given to you yet.</p>
      )}
    </div>
  );

};
export default ManagerReports;