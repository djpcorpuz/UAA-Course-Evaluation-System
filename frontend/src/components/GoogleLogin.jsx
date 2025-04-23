import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Login = () => {
const navigate = useNavigate();

  const onSuccess = (res) => {
    // Handle successful login
    //console.log('Login success:', res);
    //navigate('/demo');
    window.location.href = '/demo';
  };

  const onFailure = (res) => {
    // Handle login failure
    console.log('Login failed:', res);
  };

  return (
    <GoogleLogin 
      buttonText="Sign in with Google"
      onSuccess={onSuccess}
      onError={(error) => console.log('Login failed:', error)}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default Login;