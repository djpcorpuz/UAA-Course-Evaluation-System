import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Login from './demopage/demopage.jsx';
import './index.css';

function App() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = (selectedRole) => {
    setRole(selectedRole);
    navigate(`/demo/${selectedRole}`);
  };

  if (!role) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Navigate to={`/demo/${role}`} replace />;
}

export default App;
