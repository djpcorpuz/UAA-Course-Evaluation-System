import React from 'react';
import './login.css';
import UAAlogo from '../assets/UAAlogo.svg';

function Login({ onLoginSuccess }) {
  return (
    <div className="login-page">
      <div className="login-header">College of Engineering</div>
      <div className="login-container">
        <img src={UAAlogo} alt="UAA Logo" className="login-logo" />
        <button className="login-button" onClick={() => onLoginSuccess('student')}>
          Student
        </button>
        <button className="login-button" onClick={() => onLoginSuccess('faculty')}>
          Faculty
        </button>
        <button className="login-button" onClick={() => onLoginSuccess('admin')}>
          Admin
        </button>
      </div>
    </div>
  );
}

export default Login;
