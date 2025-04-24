import React from 'react';
import { useNavigate } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import StudentDesktop from './student-desktop.jsx';
import StudentMobile  from './student-mobile.jsx';

export default function DemoStudent() {
  const navigate = useNavigate();
  const handleLogout = () => navigate('/');

  return (
    <>
      <MediaQuery maxWidth={767}>
        <StudentMobile  onLogout={handleLogout} />
      </MediaQuery>
      <MediaQuery minWidth={768}>
        <StudentDesktop onLogout={handleLogout} />
      </MediaQuery>
    </>
  );
}
