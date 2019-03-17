import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import {
  Table,
  Segment,
  Icon
} from "semantic-ui-react";
import { connect } from "react-redux";

import NoteOptions from "./NoteOptions";
const NoteService = require("../../api/NoteServices");

/*
const Notelist = props => {
  console.log("Notebooks is %o", props);
  return (

  );
};
*/



class NotebookList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notebooks: [],
      notes: [],
      currentNote: {},
      currentNotebook: ""
    };
  }

  componentDidMount() {
    if (!this.props.isSignedIn) {
      this.props.history.push("/login");
    }

    if (this.props.isSignedIn) {
      NoteService.getNotebooks(this.props.currentUserObj.user_email)
        .then(rsp => {
          const notebooks = rsp.map((element, i) => {
            return {
              key: i + 1,
              value: element,
              text: element
            };
          });
          this.setState({ notebooks });
        })
        .catch(error => {
          console.log("Error in getting notebooks %o", error);
          return;
        });
    }
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (!this.props.isSignedIn) {
      prevProps.history.push("/login");
    }
  }

  selectNotebook = e => {
    const nb = e.target.id;
    if (nb === this.state.currentNotebook){
      this.setState({
        currentNotebook: '',
        notes:[]
      });
    } else {
    NoteService.listNotes(this.props.currentUserObj.user_email, e.target.id)
      .then(notes => {
        this.setState({ notes });
        this.setState({
          currentNotebook: nb
        });
      })
      .catch(error => console.log(error));
      }
  };

  renderList = nb => {

    if (nb === this.state.currentNotebook) {
      return this.state.notes.map((currentNote, i) => {
        return (
          <Table.Row key={i}>
            <Table.Cell width="4"/>
            <Table.Cell width="5"><Link to={`/notes/edit/${currentNote._id}`}>{currentNote.title}</Link></Table.Cell>
            <Table.Cell textAlign='right' width="3">
              <Moment fromNow ago>
                      {currentNote.updated}
              </Moment>
              &nbsp;ago
            </Table.Cell>
            <Table.Cell textAlign='right' width="4">
              <NoteOptions
                onSelectRemove={this.onSelectRemove}
                onNotebookChange={this.onNotebookChange}
                currentNote={currentNote}
              />
            </Table.Cell>
          </Table.Row>

        );
      });
    } else {
      return null;
    }
  }

  onNotebookChange = (currentNote, newNotebook) => {
    if (currentNote.notebook!== newNotebook){
      currentNote.notebook = newNotebook;
      NoteService.updateNote(currentNote)
        .then(rsp => {
          NoteService.listNotes(this.props.currentUserObj.user_email, this.state.currentNotebook)
            .then(notes => {
              this.setState({ notes });
              return;
            })
            .catch(error => {
              console.log(error);
              return;
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  onSelectRemove = id => {
    NoteService.removeNote(id).then(rsp => {
      if (rsp.data.status === "Success") {
        //Update state.
        NoteService.listNotes(
          this.props.currentUserObj.user_email,
          this.state.currentNotebook
        )
          .then(notes => {
              this.setState({ notes });
              return;
          })
          .catch(error => {
            console.log("Error in getting notes %o", error);
            return;
          });
      }
    });
  };


  getNotebooks = (currentNotebook, key) => {
    return (
      <React.Fragment key={key}>
      <Table.Row key={currentNotebook.value}>
        <Table.Cell width="4">{currentNotebook.value}</Table.Cell>
        <Table.Cell width="5">
          <Icon
            name="angle right"
            id={currentNotebook.value}
            onClick={this.selectNotebook}
          />
        </Table.Cell>
        <Table.Cell width="3"/>
        <Table.Cell textAlign='right' width="4">
                  <Icon
                    floating="true"
                    button="true"
                    name="setting"
                    id={currentNotebook.value}
                    onClick={this.selectNotebookAction}
                  />
        </Table.Cell>

      </Table.Row>
      {this.renderList(currentNotebook.value)}
    </React.Fragment>
    );
  };

  notebooksList() {
    return this.state.notebooks.map((currentNotebook, i) => {
      return this.getNotebooks(currentNotebook, i);
    });
  }

  render() {
    return (
      <div className="ui container">
        <Segment>
          <Table striped color="red" key="red">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width="4">Notebook</Table.HeaderCell>
                <Table.HeaderCell width="5" />
                <Table.HeaderCell textAlign='right' width="3">Updated</Table.HeaderCell>
                <Table.HeaderCell textAlign='right' width="4">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.notebooksList()}</Table.Body>
          </Table>
        </Segment>
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
)(NotebookList);
