import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const predefinedTags = [
  "Excellent teamwork", "Needs better time management", "Shows leadership",
  "Good communication", "Lacks initiative", "Highly dependable"
];

const subcategoriesByMain = {
  Leadership: ["Supportiveness", "Motivation", "Fairness"],
  Communication: ["Clarity", "Feedback", "Listening Skills"],
  "Team Management": ["Conflict Resolution", "Delegation", "Inclusivity"],
  Professionalism: ["Accountability", "Reliability", "Punctuality"],
  "Growth And Development": ["Mentorship", "Opportunities for Growth", "Recognition"]
};

const JuniorFeedbackForm = () => {

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [ratings, setRatings] = useState({});
  const [evaluateMore, setEvaluateMore] = useState('');
  const [evaluateLess, setEvaluateLess] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);



  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.id) {
      axios.get(`http://localhost/login_form/backend/getManager.php?user_id=${user.id}`)
        .then(res => {
          setEmployees([res.data]);
          if (res.data && res.data.id) {
            setSelectedEmployee(res.data.id);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch manager", err);
          setLoading(false);

        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRatingChange = (category, value) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleTagClick = (tag) => {
    setComment(prev => prev ? `${prev}, ${tag}` : tag);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEmployee || Object.keys(ratings).length === 0 || !comment) {
      alert('All fields are required.');
      return;
    }

    try {
      const feedbackEntries = Object.entries(ratings).map(([name, rating]) => ({
        name,
        rating
      }));

      const response = await axios.post('http://localhost/login_form/backend/Manager/submitFeedback.php', {
        from_user_id: user.id,
        to_user_id: selectedEmployee,
        comment,
        evaluate_more: evaluateMore,
        evaluate_less: evaluateLess,
        feedback: feedbackEntries
      });

      console.log(" RESPONSE:", response.data);

      setShowSuccess(true);
      setSelectedEmployee('');
      setRatings({});
      setEvaluateMore('');
      setEvaluateLess('');
      setComment('');
    } catch (error) {
      console.error('Error submitting feedback:', error.response ? error.response.data : error.message);
      alert('Submission failed: ' + (error.response ? error.response.data.error : error.message));
    }
  };


  if (!user || user.role !== 'junior employee') {
    return (
      <section className="d-flex justify-content-center align-items-center py-5 px-3" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="alert alert-warning" role="alert">
          This feedback form is only accessible to Junior Employees.
        </div>
      </section>
    );
  }

  return (
    <section className="d-flex justify-content-center align-items-center py-5 px-3" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-8 col-xl-7">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h3 className="text-center fw-bold text-primary mb-4">Submit Feedback</h3>
                {showSuccess && (
                  <div className="alert alert-success" role="alert">
                    Feedback submitted
                  </div>
                )}

                {loading ? (
                  <p className="text-center">Loading manager details...</p>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label">Select Manager</label>
                      <select id="managerSelect" className="form-select" value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} required>

                        <option value="">Choose</option>

                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.username} ({emp.role || 'employee'})
                          </option>
                        ))}
                      </select>
                    </div>

                    {Object.entries(subcategoriesByMain).map(([main, subs]) => (
                      <div key={main} className="mb-4">
                        <h5 className="fw-bold text-dark mt-4 mb-3">{main}</h5>
                        <div className="row">
                          {subs.map(sub => (
                            <div key={sub} className={`col-sm-6 col-md-4 mb-3`}>
                              <label className="form-label fw-semibold">{sub}</label>
                              <div className="d-flex align-items-center">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <i key={star}
                                    className={`bi bi-star${ratings[sub] >= star ? '-fill' : ''}`}
                                    style={{ fontSize: '1.5rem', cursor: 'pointer', color: '#ffc107', marginRight: '4px' }}
                                    onClick={() => handleRatingChange(sub, star)}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="mb-4">
                      <label className="form-label">Suggestions</label>
                      <div className="d-flex flex-wrap gap-2">
                        {predefinedTags.map((tag, idx) => (
                          <button
                            type="button"
                            key={idx}
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleTagClick(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="row g-4 mb-4">
                      <div className="col-md-4">
                        <div className="p-3 border rounded bg-light h-100">
                          <label className="form-label fw-semibold text-primary">
                            <i className="bi bi-arrow-up-right me-1"></i> Evaluate More
                          </label>
                          <textarea className="form-control" rows="2" value={evaluateMore} onChange={e => setEvaluateMore(e.target.value)} />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="p-3 border rounded bg-light h-100">
                          <label className="form-label fw-semibold text-danger">
                            <i className="bi bi-arrow-down-left me-1"></i> Evaluate Less
                          </label>
                          <textarea className="form-control" rows="2" value={evaluateLess} onChange={e => setEvaluateLess(e.target.value)} />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="p-3 border rounded bg-light h-100">
                          <label className="form-label fw-semibold text-secondary">
                            <i className="bi bi-chat-dots me-1"></i> Additional Comment
                          </label>
                          <textarea
                            id="comment"
                            className="form-control"
                            rows="2"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            required />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JuniorFeedbackForm;