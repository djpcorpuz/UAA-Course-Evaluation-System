import React, { useState } from 'react';
import MediaQuery from 'react-responsive';
import Login from './login/login.jsx';
import StudentDesktop from './student/student-desktop.jsx';
import StudentMobile from './student/student-mobile.jsx';
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
    return (
      <>
        <MediaQuery maxWidth={767}>
          <StudentMobile onLogout={handleLogout} />
        </MediaQuery>
        <MediaQuery minWidth={768}>
          <StudentDesktop onLogout={handleLogout} />
        </MediaQuery>
      </>
    );
  } else if (role === 'faculty') {
    return <FacultyDesktop onLogout={handleLogout} />;
  } else if (role === 'admin') {
    return <AdminDesktop onLogout={handleLogout} />;
  }
}

export default App;
