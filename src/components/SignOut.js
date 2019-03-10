import React, { Component } from "react";
import { Dropdown, Image } from 'semantic-ui-react'
import { connect } from 'react-redux';

//this.props.onSignOutClick

const options = [
  { key: 'user', text: 'Account', icon: 'user' },
  { key: 'settings', text: 'Settings', icon: 'settings' },
  { key: 'sign-out', text: 'Sign Out', icon: 'sign out' },
]

class SignOut extends React.Component {
  constructor(props){
    super(props)
    console.log("Current note is %o", this.props.currentNote);
  }






  render() {
    return (

      <div className="right floated content">
        <Dropdown className='link item icon' trigger={this.props.currentUserObj.user_email}>
          <Dropdown.Menu>
            <Dropdown.Item icon='user' text='Account'/>
            <Dropdown.Item icon='settings' text='Settings'/>
            <Dropdown.Item icon='sign out' text='Sign Out' onClick={this.props.onSignOutClick}/>
          </Dropdown.Menu>
        </Dropdown>

      </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    currentUserObj: state.auth.userObj,
    isSignedIn: state.auth.isSignedIn
  };
};
export default connect(
  mapStateToProps,
  { }
)(SignOut);
