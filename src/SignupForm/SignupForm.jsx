import React, { useState } from 'react';
import '../LoginForm/LoginForm.css';
import { FaUserAlt, FaLock, FaEnvelope } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    } else {
      setPasswordError('');
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);

    try {
      const res = await fetch('http://localhost/login_form/backend/signup.php', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json(); 
      console.log("Signup response:", result);

      if (result.success) {
        localStorage.setItem("role", "junior employee");
        localStorage.setItem("username", username);
        navigate('/dashboard/junioremployee');
      } else {
        alert(result.message || "Signup failed.");
      }
    } catch (err) {
      alert("Error: " + err.message);
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Sign up</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUserAlt className='icon' />
          </div>

          <div className="input-box">
            <input
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className='icon' />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className='icon' />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FaLock className='icon' />
          </div>

          {passwordError && (
            <p style={{ color: 'red', fontSize: '14px', marginTop: '-15px' }}>{passwordError}</p>
          )}

          <button type="submit">Sign up</button>

          <div className="register-link">
            <p>Already have an account?{" "}
              <Link to="/login" style={{ fontWeight: '600', textDecoration: 'none', color: '#fff' }}>Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
