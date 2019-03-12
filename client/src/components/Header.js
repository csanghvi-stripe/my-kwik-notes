import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';

const Header = () => {
  return (
    <div className="ui secondary pointing menu">
      <Link to="/" className="item">
        Kwik-Notes
      </Link>
      <div className="right menu">
        <Link to="/" className="item">
          My Notes
        </Link>
        <Logout />
      </div>
    </div>
  );
};

export default Header;
