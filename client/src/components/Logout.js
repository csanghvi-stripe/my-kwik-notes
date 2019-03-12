import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { signIn, signOut } from "../actions";
import UserOptions from "./UserOptions";

class Logout extends React.Component {
  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId: process.env.REACT_APP_CLIENT_ID,
          scope: "email"
        })
        .then(() => {
          this.auth = window.gapi.auth2.getAuthInstance();
        });
    });
  }

  onSignOutClick = () => {
    this.auth.signOut();
    console.log("Redirecting to /login");
    return <Redirect to="/login" />;
  };

  renderSignoutButton() {
    if (this.props.isSignedIn) {
      return <UserOptions onSignOutClick={this.onSignOutClick} />;
    }
  }


  render() {
    return <div>{this.renderSignoutButton()}</div>;
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
  { signIn, signOut }
)(Logout);
