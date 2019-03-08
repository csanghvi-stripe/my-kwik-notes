import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
      <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light text-md-right">
        <Link to="/" className="navbar-brand">Home</Link>
        <div className="collpase navbar-collapse text-right">
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item">
            <Link to="/content" className="nav-link"><span className="fas fa-user"></span> Sign Up</Link>
          </li>
          <li className="nav-item">
              <Link to="/create" className="nav-link"><span className="fas fa-sign-in-alt"></span> Login</Link>
          </li>
        </ul>
        </div>
      </nav>
      </div>
    );
};

export default Header;
