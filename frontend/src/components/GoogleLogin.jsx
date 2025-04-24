import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './GoogleLogin.css';

const Login = () => {
const navigate = useNavigate();

  const onSuccess = (res) => {
    // Handle successful login
    //console.log('Login success:', res);
    //navigate('/demo');
    navigate('/demo');
  };

  const onFailure = (res) => {
    // Handle login failure
    console.log('Login failed:', res);
  };

  return (
    <div className="google-login-page">
      <div className="google-login-card">
        <h1 className="google-login-title">College of Engineering (DEMO)</h1>
        <div className="google-login-button-wrapper">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onFailure}
            useOneTap={false}
            cookiePolicy="single_host_origin"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;