
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LandingPage.css";

import feedbackImg from "./Components/Assets/feedback.jpeg";

const LandingPage = () => {
  return (
    <div className="landing-wrapper">
     
      
      <nav className="navbar navbar-expand-lg px-4 py-3" style={{ backgroundColor: 'transparent' }}>
  <a className="navbar-brand text-white fw-bold" href="#">
   
    Performa
  </a>
  <div className="collapse navbar-collapse justify-content-center">
    <ul className="navbar-nav">
     
    
    </ul>
  </div>
  <a className="btn btn-outline-light fw-semibold" href="/login">Log in →</a>
</nav>


     
      <div className="container mt-5 pt-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <span className="badge rounded-pill mb-3">#EmpowerPerformance</span>
            <h1 className="display-5 fw-bold">
              Welcome to Performa 
            </h1>
            <p className="text-muted">
            Facilitate structured, insightful, and scalable team feedback with Performa. 
            Leverage streamlined tools to enhance performance evaluation, support goal achievement, and promote continuous organizational improvement.
            </p>
            <a className="btn btn-outline-light rounded-pill px-4 fw-bold" href="/signup">
              Get started →
            </a>
          </div>
          <div className="col-md-6 text-center">
            <img
              src={feedbackImg}
              
              className="img-fluid hero-image"
              style={{ maxHeight: "400px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
