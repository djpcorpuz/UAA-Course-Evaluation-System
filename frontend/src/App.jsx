import React, { useState } from 'react';
import MediaQuery from 'react-responsive';
//import Login from './components/login.jsx';
import StudentDesktop from './components/student-desktop.jsx';
import StudentMobile from './components/student-mobile.jsx';
import FacultyDesktop from './components/faculty-desktop.jsx';
import AdminDesktop from './components/admin-desktop.jsx';
import '/index.css';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound.jsx';
import Home from './pages/Home.jsx';
import AuthPage from './pages/AuthPage.jsx';
import { useAuthentication } from './auth.js';
import Login from './components/googleLogin.jsx'; // Assuming you have a Google login component

function App() {

  const {isAuthorized} = useAuthentication();
  const ProtectedLogin = () => {
    return isAuthorized ? <Navigate to='/' /> : <AuthPage initialMethod='login' />
  }

  return (
    <div>
      <BrowserRouter>
        <Navbar />
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
