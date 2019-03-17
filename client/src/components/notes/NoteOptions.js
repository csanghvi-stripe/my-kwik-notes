import React from "react";
import Modal from "../Modal";
import { Dropdown } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
const NoteService = require("../../api/NoteServices");

class NoteOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      notebookChange: false,
      noteEdit: false,
      currentNotebook:'',
      notebooks:[]
    };
  }

/*
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    console.log("Did Update %o", prevProps);
  }

  componentDidMount() {
    console.log("Did mount %o", this.props);
  }

  componentWillReceiveProps(nextProps){
    console.log("Will receive %o", nextProps)

  }
  */
  setShow = () => {
    this.setState({
      show: true
    });
  };
  unSetShow() {
    this.setState({
      show: false
    });
  }

  setNotebookChange = () => {
    NoteService.getNotebooks(this.props.currentUserObj.user_email)
      .then(rsp => {
        const notebooks = rsp.map((element, i) => {
          return {
            key:  i,
            value: element,
            text: element
          };
        });
        this.setState({ notebooks });
        this.setState({
          notebookChange: true
        });
      })
      .catch(error => {
        console.log("Error in getting notebooks %o", error);
        return;
      });

  };
  unSetNotebookChange() {
    this.setState({
      notebookChange: false
    });
  }

  setNewNotebook(newNotebook) {
    this.props.onNotebookChange(this.props.currentNote, newNotebook);

    this.setState({
      notebookChange: false
    });
  }

  setCurrentNotebook = (e, { value }) => {
    this.setState({ currentNotebook: value });
    this.setNewNotebook(value);
  }

  deleteNote() {
    this.props.onSelectRemove(this.props.currentNote._id);

    this.setState({
      show: false
    });
  }

  renderDeleteActions() {
    return (
      <React.Fragment>
        <button
          onClick={() => this.deleteNote()}
          className="ui button negative"
        >
          Delete
        </button>
        <button onClick={() => this.unSetShow()} className="ui button negative">
          Cancel
        </button>
      </React.Fragment>
    );
  }

  renderDeleteContent() {
    return "Are you sure you want to delete this note?";
  }


  renderNBActions() {
    return (
      <React.Fragment>
        <Dropdown
          placeholder={this.props.currentNote.notebook}
          selection
          options={this.state.notebooks}
          value={this.state.currentNotebook}
          onChange={this.setCurrentNotebook}
        />
      </React.Fragment>
    );
  }

  renderNBContent() {
    return "Which Notebook do you want to move this to";
  }



  renderNoteEditor = () => {
    this.setState({
      noteEdit: true
    });

    //return <Redirect to={`/notes/edit/${this.props.currentNote}`}/>
  };

  render() {
    if (this.state.noteEdit === true) {
      return <Redirect to={`/notes/edit/${this.props.currentNote._id}`} />;
    }
    return (
      <div className="right floated content">
        <Dropdown icon="setting" floating button className="icon">
          <Dropdown.Menu>
            <Dropdown.Item icon="trash" text="Delete" onClick={this.setShow} />
            <Dropdown.Item icon="share alternate" text="Share" />
            <Dropdown.Item icon="exchange" text="Change Notebook" onClick={this.setNotebookChange}/>
            <Dropdown.Item
              icon="edit"
              text="Edit"
              onClick={this.renderNoteEditor}
            />
          </Dropdown.Menu>
        </Dropdown>
        {this.state.show === true && (
          <Modal
            title="Delete Note"
            content={this.renderDeleteContent()}
            actions={this.renderDeleteActions()}
            onDismiss={() => this.unSetShow()}
          />
        )}
        {this.state.notebookChange === true && (
          <Modal
            title="Change Notebook"
            content={this.renderNBContent()}
            actions={this.renderNBActions()}
            onDismiss={() => this.unSetNotebookChange()}
          />
        )}
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
  {}
)(NoteOptions);
