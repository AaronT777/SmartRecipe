import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-success" aria-label="Go to Homepage">
            Go to Homepage
          </Link>
          <Link to="/search" className="btn btn-outline-success ms-3" aria-label="Search for recipes">
            Search Recipes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;