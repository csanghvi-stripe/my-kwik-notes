import React from 'react';
import { Link } from 'react-router-dom';
import Logout from './Logout';


import logo from "../img/logo.png";


const Header = () => {
  return (
    <div className="ui secondary pointing menu">

      <Link to="/" className="item">
        <img src={logo} style={{width: 120, height: 15}} alt="kwik-notes.com" />
      </Link>
      <div className="right menu">
        <Link to="/notes/list" className="item">
          My Notes
        </Link>
        <Logout />
      </div>
    </div>
  );
};

export default Header;
