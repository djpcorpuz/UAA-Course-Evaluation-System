import React from 'react';
import { GoogleLogin } from 'react-google-login';

const Login = () => {
  const onSuccess = (res) => {
    // Handle successful login
    console.log('Login success:', res);
  };

  const onFailure = (res) => {
    // Handle login failure
    console.log('Login failed:', res);
  };

  return (
    <GoogleLogin 
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Sign in with Google"
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default Login;