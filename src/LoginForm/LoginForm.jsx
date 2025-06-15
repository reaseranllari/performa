import React, { useState } from 'react';
import '../LoginForm/LoginForm.css';
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const LoginForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("handleLogin function triggered");


    console.log("Trying to log in with:", email, password);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      console.log("About to fetch...");
      const res = await fetch("http://localhost/login_form/backend/login.php", {
        method: "POST",
        body: formData,
      });
      console.log("Fetch completed");

      
      const text = await res.text(); 
      console.log("RAW RESPONSE:", text);
      
      let data;
      try {
        data = JSON.parse(text); 
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        alert("Server response is not valid JSON");
        return;
      }
      


  
       if (data.success) {
        const userObject = {
          id: data.id,
          username: data.username,
          role: data.role
        };
        localStorage.setItem("user", JSON.stringify(userObject)); 
        localStorage.setItem("role", data.role); 
        localStorage.setItem("username", data.username);

        const route = data.role.toLowerCase().replace(/\s+/g, ''); 
        navigate(`/dashboard/${route}`);
      }
     
     
       else {
        alert(data.message);
      }
    } catch (err) {
        console.error("Error during login:", err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="auth-container">
    <div className='wrapper'>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>

        <div className="input-box">
          <input
            type="email"
            id="username" 
            name="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FaUserAlt className='icon' />
        </div>

        <div className="input-box">
          <input
            type="password"
            id="password" 
            name="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className='icon' />
        </div>

       

        <button type="submit">Login</button>

       

<div className="register-link">
  <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
</div>

      </form>
    </div>
    </div>
  );
};

export default LoginForm;

