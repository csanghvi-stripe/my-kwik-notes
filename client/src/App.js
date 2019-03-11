import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Message } from 'semantic-ui-react'
import Header from './components/Header';
import SideBar from './components/Sidebar';
import NoteManager from './components/notes/NoteManager';
import NoteEdit from './components/notes/NoteEdit';
import { connect } from 'react-redux';
import './App.css';



class App extends Component {
  renderSidebar() {
  if (this.props.isSignedIn) {
    return (
      <div>
          <SideBar/>
      </div>
    );
  }
}
renderNoteManager() {
  if (this.props.isSignedIn) {
    return (
      <div className='ui container'>
          <NoteManager/>
      </div>
    );
  }
}


renderLoginFailure(){
  if (this.props.isSignedIn === null) {
    return null;
  } else if (!this.props.isSignedIn) {
    return (
      <div className="ui one column stackable center">
        <br/ >
        <div >
        <Message negative>
          <Message.Header>Failed to login with reason: {this.props.loginError}.</Message.Header>
          <p>Maybe try clearing cache first?</p>
        </Message>
        </div>
      </div>
    );
  }
}
  render() {
    return (
    <div>

      <Router>
        <div>

          {this.renderSidebar()}
          <div className="ui container">
              <Header />
          </div>

          <div className="ui container">
            {this.renderLoginFailure()}
            {this.renderNoteManager()}

            <Switch>
              <Route exact path="/notes/:id" component={NoteEdit} />
              <Route exact path="/notes/manage" component={NoteManager} />
            </Switch>
        </div>
      </div>
      </Router>
    </div>
  );
  }
}

const mapStateToProps = state => {
  return {
    currentUserObj: state.auth.userObj,
    isSignedIn: state.auth.isSignedIn,
    loginError:state.auth.loginError

  };
};
export default connect(
  mapStateToProps,
  { }
)(App);
