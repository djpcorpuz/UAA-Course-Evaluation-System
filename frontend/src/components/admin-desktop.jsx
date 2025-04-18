import React from 'react';
import '../styles/admin-desktop.css';

function AdminDesktop({ onLogout }) {
  return (
    <div className="admin-container">
      <h1>Admin Desktop</h1>
      <p>Welcome to your admin dashboard!</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default AdminDesktop;
