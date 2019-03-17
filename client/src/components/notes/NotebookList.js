import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import {
  List,
  Dropdown,
  Table,
  Segment,
  Container,
  Grid,
  Button,
  Icon
} from "semantic-ui-react";
import { connect } from "react-redux";
const NoteService = require("../../api/NoteServices");

/*
const Notelist = props => {
  console.log("Notebooks is %o", props);
  return (

  );
};
*/

const NotesList = props => {

  return (
    <List.Item key={props.note._id}>
      <List.Content>
        <List.Header>
          <Link to={`/notes/edit/${props.note._id}`}>{props.note.title}</Link>
        </List.Header>
      </List.Content>
      <List.Description size="small">
        <Moment fromNow ago>
          {props.note.updated}
        </Moment>
        &nbsp;ago
      </List.Description>
    </List.Item>
  );
};

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
          <List divided key={i}>
            <NotesList note={currentNote} key={i} />
          </List>
        );
      });
    } else {
      return null;
    }
  };

  getNotebooks = (currentNotebook, key) => {
    return (
      <Table.Row key={currentNotebook.value}>
        <Table.Cell width="5">{currentNotebook.value}</Table.Cell>
        <Table.Cell width="1">
          <Icon
            name="angle right"
            id={currentNotebook.value}
            onClick={this.selectNotebook}
          />
        </Table.Cell>
        <Table.Cell width="10" verticalAlign="bottom">
          {this.renderList(currentNotebook.value)}
        </Table.Cell>
      </Table.Row>
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
          <Table color="red" key="red">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width="5">Notebook</Table.HeaderCell>
                <Table.HeaderCell width="1" />
                <Table.HeaderCell width="10">Notes</Table.HeaderCell>
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
