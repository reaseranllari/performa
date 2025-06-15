import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SeniorNotes = () => {
  const [juniors, setJuniors] = useState([]);
  const [toUserId, setToUserId] = useState('');
  const [content, setContent] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
  
    axios.get('http://localhost/login_form/backend/Senior/getJuniors.php')
      .then(res => {
        console.log("Fetched juniors:", res.data);
        setJuniors(res.data);
      })
      .catch(err => {
        console.error('Error fetching juniors:', err);
      });
  }, []);

  const handleSendNote = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!toUserId || !content) {
      setErrorMsg('Please select a user and write a note.');
      return;
    }

    axios.post('http://localhost/login_form/backend/Senior/sendNote.php', {
      from_user_id: user.id,
      to_user_id: toUserId,
      content: content
    })
    .then(res => {
      if (res.data.success) {
        setSuccessMsg('Note sent successfully!');
        setContent('');
        setToUserId('');
      } else {
        setErrorMsg(res.data.message || 'Something went wrong.');
      }
    })
    .catch(err => {
      console.error(err);
      setErrorMsg('Failed to send note.');
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h4 className="text-center mb-4">Send Note</h4>
  
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
  
        <form onSubmit={handleSendNote}>
          <div className="mb-3">
            <label className="form-label fw-bold">Select Junior:</label>
            <select
              value={toUserId}
              onChange={(e) => setToUserId(e.target.value)}
              className="form-select"
            >
              <option value="">-- Select Employee --</option>
              {Array.isArray(juniors) && juniors.length > 0 ? (
                juniors.map(j => (
                  <option key={j.id} value={j.id}>{j.username}</option>
                ))
              ) : (
                <option disabled>No junior employees found</option>
              )}
            </select>
          </div>
  
          <div className="mb-3">
            <label className="form-label fw-bold">Note:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-control"
              rows="4"
              placeholder="Write your note here..."
            />
          </div>
  
          <button type="submit" className="btn btn-primary w-100">Send Note</button>
        </form>
      </div>
    </div>
  );
}

export default SeniorNotes;
