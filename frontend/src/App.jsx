import React, { useState } from 'react';
import MediaQuery from 'react-responsive';
import Login from './components/login.jsx';
import StudentDesktop from './components/student-desktop.jsx';
import StudentMobile from './components/student-mobile.jsx';
import FacultyDesktop from './components/faculty-desktop.jsx';
import AdminDesktop from './components/admin-desktop.jsx';
import './index.css';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound.jsx';
import Home from './pages/Home.jsx';
import AuthPage from './pages/AuthPage.jsx';
import { useAuthentication } from './auth.js';

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


  const {isAuthorized} = useAuthentication();
  const ProtectedLogin = () => {
    return isAuthorized ? <Navigate to='/' /> : <AuthPage initialMethod='login' />
  }
  const ProtectedRegister = () => {
    return isAuthorized ? <Navigate to='/' /> : <AuthPage initialMethod='register' />
  }

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <ToastContainer />  {/* To display notifications */}
        <Routes>
          <Route path="/login" element={<ProtectedLogin />} />
          <Route path="/register" element={<ProtectedRegister />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
