import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <h5 className="mb-0">Fantasy Sports</h5>
        </Link>
        <button 
          className={`navbar-toggler ${isOpen ? '' : 'collapsed'}`}
          type="button" 
          onClick={handleToggle}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/summary" 
                className={`nav-link ${location.pathname === '/summary' ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                My Teams
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center mt-2 mt-lg-0">
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
