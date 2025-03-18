import React, { useState } from 'react';
import Login from './login/login.jsx';
import StudentDesktop from './student/student-desktop.jsx';
import FacultyDesktop from './faculty/faculty-desktop.jsx';
import AdminDesktop from './admin/admin-desktop.jsx';
import './index.css';

function App() {
  const [role, setRole] = useState(null);

  const handleLoginSuccess = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  if (!role) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  } else if (role === 'student') {
    return <StudentDesktop onLogout={handleLogout} />;
  } else if (role === 'faculty') {
    return <FacultyDesktop onLogout={handleLogout} />;
  } else if (role === 'admin') {
    return <AdminDesktop onLogout={handleLogout} />;
  }
}

export default App;
