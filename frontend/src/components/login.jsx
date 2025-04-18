import React, { useEffect, useState } from 'react';
import '../styles/login.css';
import UAAlogo from '../assets/UAAlogo.svg';

function Login({ onLoginSuccess }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="login-page">
      <div className="login-header">College of Engineering (DEMO)</div>
      <div className="login-container">
      <a href="https://www.uaa.alaska.edu/" target="_blank" rel="noopener noreferrer">
        <img src={UAAlogo} alt="UAA Logo" className="login-logo" />
      </a>
        <button className="login-button" onClick={() => onLoginSuccess('student')}>
          Student
        </button>
        {!isMobile && (
          <>
            <button className="login-button" onClick={() => onLoginSuccess('faculty')}>
              Faculty
            </button>
            <button className="login-button" onClick={() => onLoginSuccess('admin')}>
              Admin
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
