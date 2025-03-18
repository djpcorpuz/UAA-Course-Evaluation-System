import React from 'react';
import './faculty-desktop.css';

function FacultyDesktop({ onLogout }) {
  return (
    <div className="faculty-container">
      <h1>Faculty Desktop</h1>
      <p>Welcome to your faculty dashboard!</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default FacultyDesktop;
