import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JuniorNotes = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user.id) {
      setError("User not found in localStorage.");
      return;
    }

    axios.get(`http://localhost/login_form/backend/Junior/getNote.php?user_id=${user.id}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setNotes(res.data);
        } else {
          setError('Failed to load notes.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('API error while loading notes.');
      });
  }, []);

  return (
    <div className="container mt-4" style={{ maxWidth: '600px', backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h4 className="text-center mb-4" style={{ color: '#343a40' }}>Your Notes</h4>

      {error && <div className="alert alert-danger text-center" style={{ color: '#721c24', backgroundColor: '#f8d7da', borderColor: '#f5c6cb' }}>{error}</div>}

      {notes.length === 0 ? (
        <div className="alert alert-info text-center" style={{ color: '#0c5460', backgroundColor: '#d1ecf1', borderColor: '#bee5eb' }}>No notes received yet.</div>
      ) : (
        <div className="card" style={{ border: '1px solid #dee2e6', borderRadius: '10px' }}>
          <div className="card-body" style={{ backgroundColor: '#ffffff' }}>
            <ul className="list-group">
              {notes.map(note => (
                <li key={note.id} className="list-group-item" style={{ backgroundColor: '#f8f9fa', borderColor: '#dee2e6' }}>
                  <h6 className="fw-bold" style={{ color: '#343a40' }}>From: {note.sender}</h6>
                  <p style={{ color: '#495057' }}>{note.content}</p>
                  <small className="text-muted">{note.timestamp}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default JuniorNotes;
