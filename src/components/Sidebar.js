import { slide as Menu } from 'react-burger-menu';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Sidebar extends Component {
  constructor(props) {
      super(props);
      this.onChangeFilterText = this.onChangeFilterText.bind(this);
      this.state = {
        filterText: '',
    };
  }
  onChangeFilterText(e) {
      this.setState({
          filterText: e.target.value
      });
  }
  render (){
  return (
    <Menu width={ 150 }>
    <Link to="/create" className="menu-item">
      + New Note
    </Link>
    <Link to="/list" className="menu-item">
      My Notes
    </Link>
    <Link to="/create" className="menu-item">
      Shared
    </Link>
    <Link to="/build" className="menu-item">
      Build
    </Link>
    <Link to="/manage" className="menu-item">
      Manage
    </Link>
    </Menu>
  );
  }
}

export default Sidebar;
