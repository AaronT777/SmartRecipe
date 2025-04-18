import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-xl navbar-light" aria-label="Main navigation">
      <div className="container">
        <Link className="navbar-brand" to="/" aria-label="SmartRecipe Home">
          <img
            className="navbar-logo"
            src="/images/logo.png"
            alt="SmartRecipe Logo"
            width="32"
            height="32"
          />
          <span className="logo-text">SmartRecipe</span>
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

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end aria-label="Home page">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/build" aria-label="Create your own recipe">
                Build Your Own
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/search" aria-label="Search recipes">
                Search
              </NavLink>
            </li>
            <li className="nav-item">
              {isLoading ? (
                <div className="d-flex align-items-center nav-link">
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : isAuthenticated ? (
                <div className="d-flex align-items-center">
                  <NavLink className="nav-link nav-user" to="/profile" aria-label="Go to your profile">
                    <span className="user-icon" aria-hidden="true">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt=""
                          className="rounded-circle"
                          width="24"
                          height="24"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faUser} />
                      )}
                    </span>
                    <span className="ms-1 d-none d-lg-inline">
                      {user?.username}
                    </span>
                  </NavLink>
                  <button 
                    className="btn btn-link nav-link nav-logout" 
                    onClick={logout}
                    aria-label="Logout"
                  >
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="logout-icon"
                      aria-hidden="true"
                    />{" "}
                    Logout
                  </button>
                </div>
              ) : (
                <div className="d-flex align-items-center">
                  <button 
                    className="btn btn-link nav-link nav-login" 
                    onClick={login}
                    aria-label="Login or register"
                  >
                    <FontAwesomeIcon 
                      icon={faUserPlus} 
                      className="login-icon"
                      aria-hidden="true"
                    />{" "}
                    Login
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}