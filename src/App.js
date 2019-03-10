import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
//import NoteCreate from './components/notes/NoteCreate';
//import NoteEdit from './components/notes/NoteEdit';
//import NoteDelete from './components/notes/NoteDelete';
//import NoteList from './components/notes/NoteList';
//import NoteShow from './components/notes/NoteShow';
import Header from './components/Header';
import SideBar from './components/Sidebar';
import NoteCreate from './components/notes/NoteCreate';
import NoteList from './components/notes/NoteList';
import NoteBuild from './components/notes/NoteBuild';
import NoteManager from './components/notes/NoteManager';
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
      <div>
          <NoteManager/>
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
            {this.renderNoteManager()}

          <Switch>
            <Route path="/create" component={NoteCreate} />
            <Route path="/list" component={NoteList} />
            <Route path="/build" component={NoteBuild} />
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
    isSignedIn: state.auth.isSignedIn
  };
};
export default connect(
  mapStateToProps,
  { }
)(App);
