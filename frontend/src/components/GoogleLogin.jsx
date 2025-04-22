import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

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
      buttonText="Sign in with Google"
      onSuccess={(res) => console.log('Login success:', res)}
      onError={(error) => console.log('Login failed:', error)}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default Login;