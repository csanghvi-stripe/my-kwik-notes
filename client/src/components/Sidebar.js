import { slide as Menu } from "react-burger-menu";
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";

import { Icon, Button } from "semantic-ui-react";

const NoteService = require("../api/NoteServices");

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNote: "",
      redirect: false
    };
  }


  createNewNote = e => {
    //Make an API call to create a document in mongo
    //Get document id & use it as id for this new entry
    var note = {
      title: "Untitled",
      description: "",
      content: {}
    };
    NoteService.addNote(
      note.title,
      note.description,
      note.content,
      this.props.currentUserObj.user_email,
      "Default"
    )
      .then(newNote => {
        this.setState({ redirect: true, currentNote: newNote.id });
      })
      .catch(error => console.log(error));
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={`/notes/edit/${this.state.currentNote}`} />;
    }
  };

  render() {
    return (
      <Menu width={150}>
        {this.renderRedirect()}
        <Button className="ui icon button" onClick={this.createNewNote}>
          <Icon className="plus" size="small" />
        </Button>
        <br />
        <Link to="/notes/list" className="menu-item">
          My Notes
        </Link>
        <br />
        <Link to="/shared" className="menu-item">
          Shared
        </Link>
        <br />
        <Link to="/notes/manage" className="menu-item">
          Manage
        </Link>
      </Menu>
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
  {}
)(Sidebar);
