import React, { useState } from 'react';
import './admin-desktop.css';

export default function AdminDesktop({ onLogout }) {
  const [toggles, setToggles] = useState(() => ({
    timelock: JSON.parse(localStorage.getItem('timelock')) || false,
    featureB: false,
    featureC: false,
  }));

  const handleToggle = (key) => {
    setToggles(prev => {
      const newVal = !prev[key];
      const updated = { ...prev, [key]: newVal };
      if (key === 'timelock') {
        localStorage.setItem('timelock', JSON.stringify(newVal));
      }
      return updated;
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="toggle-container">
          <div className={`toggle-item ${toggles.timelock ? 'toggle-on' : ''}`}>
            <span className="toggle-label">Lock Editing</span>
            <button
              className="toggle-button"
              onClick={() => handleToggle('timelock')}
            >
              {toggles.timelock ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className={`toggle-item ${toggles.featureB ? 'toggle-on' : ''}`}>
            <span className="toggle-label">Feature B</span>
            <button
              className="toggle-button"
              onClick={() => handleToggle('featureB')}
            >
              {toggles.featureB ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className={`toggle-item ${toggles.featureC ? 'toggle-on' : ''}`}>
            <span className="toggle-label">Feature C</span>
            <button
              className="toggle-button"
              onClick={() => handleToggle('featureC')}
            >
              {toggles.featureC ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="admin-footer">
          <button className="admin-logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
