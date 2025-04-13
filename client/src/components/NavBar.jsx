import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";

export default function NavBar() {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-xl navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="logo-text">🍴 SmartRecipe</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/build">Build Your Own</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">Search</Link>
            </li>
            <li className="nav-item">
              {isLoading ? (
                <div className="d-flex align-items-center nav-link">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : isAuthenticated ? (
                <div className="d-flex align-items-center">
                  <Link className="nav-link" to="/profile">
                    <span className="user-icon">
                      {user?.picture ? (
                        <img 
                          src={user.picture} 
                          alt={user.username} 
                          className="rounded-circle" 
                          width="24" 
                          height="24"
                        />
                      ) : (
                        '👤'
                      )}
                    </span>
                    <span className="ms-1 d-none d-lg-inline">{user?.username}</span>
                  </Link>
                  <button 
                    className="btn btn-link nav-link" 
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button className="btn btn-link nav-link" onClick={login}>
                  <span className="user-icon">👤</span> Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
