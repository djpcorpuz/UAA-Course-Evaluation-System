import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-header">Welcome to the Home Page</div>
      <div className="home-container">
        <Link to="/login">
          <button className="home-button">
            Google
          </button>
        </Link>
      </div>
    </div>
  );
}
