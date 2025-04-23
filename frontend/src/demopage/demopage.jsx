import React, { useEffect, useState } from 'react';
import './demopage.css';
import UAAlogo from '../assets/UAAlogo.svg';

export default function Demopage({ onLoginSuccess }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="demo-wrapper">
      <div className="demo-card">
        <a href="https://www.uaa.alaska.edu/" target="_blank" rel="noopener noreferrer">
          <img src={UAAlogo} alt="UAA Logo" className="demo-logo" />
        </a>
        <button className="demo-button" onClick={() => onLoginSuccess('student')}>
          Student
        </button>
        {!isMobile && (
          <>
            <button className="demo-button" onClick={() => onLoginSuccess('faculty')}>
              Faculty
            </button>
            <button className="demo-button" onClick={() => onLoginSuccess('admin')}>
              Admin
            </button>
          </>
        )}
      </div>
    </div>
  );
}
