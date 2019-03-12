//{id:1, title:"first test", description:"my content", content:{}},{id:2, title:"Second test", description:"my content", content:{}},{id:3, title:"Third test", description:"my content", content:{}}
import React from 'react'
import Moment from 'react-moment';
import { Router, Route, Switch, Redirect} from "react-router-dom";


import { connect } from 'react-redux';

import {Dropdown, Header, Input, Icon, Container, Button, Divider, Grid, Segment, List } from 'semantic-ui-react'
import NoteOptions from './NoteOptions';
import NoteEdit from './NoteEdit';
import NotebookCreate from './NotebookCreate';


const NoteService = require('../../api/NoteServices');



const dditems = [
{ key: 1, text: 'New Notebook', value: 'Create', icon: 'plus' },
{ key: 2, text: 'All', value: 'All' }
]


const Notes = props => {
  return (
  <List.Item id={props.note._id} value={props.note._id} onClick={() => {props.onNoteSelect(props.note._id)}}>
      <List.Content>

        <Grid columns={2} stackable>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
            <List.Header as='a'>{props.note.title}
              </List.Header>
            </Grid.Column>
            <Grid.Column>
              <List.Header>
                <NoteOptions currentNote={props.note._id} onSelectRemove={props.onSelectRemove}/>
              </List.Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <br/>
        <List.Description size='small'>
        {props.note.description.slice(0,30)}
        </List.Description>
        <br/>
        <List.Description size='small'>
        <Moment fromNow ago >{props.note.updated}</Moment>
          &nbsp;ago
        </List.Description>
    </List.Content>
  </List.Item>

)
}
/*
<List.Header size='large' id={props.note._id} as='a' onClick={props.onNoteSelect}>{props.note.title}</List.Header>
  <Menu compact>
    <Dropdown text='Dropdown' options={options} simple item />
  </Menu>

<Grid columns={2} stackable>
  <Grid.Row verticalAlign='left'>
    <Grid.Column>
    <List.Header size='large' id={props.note._id} as='a' onClick={props.onNoteSelect}>{props.note.title}</List.Header>
    </Grid.Column>
    <Grid.Column>
    <List.Header size='large' id={props.note._id} as='a' onClick={props.onNoteSelect}>{props.note.updated}</List.Header>
    </Grid.Column>
  </Grid.Row>
</Grid>
*/



class NoteManager extends React.Component {
  constructor(props) {
      super(props);
      this.selectNote = this.selectNote.bind(this);
      this.notesList = this.notesList.bind(this);
      this.createNewNote = this.createNewNote.bind(this);
      this.handleSave = this.handleSave.bind(this);
      this.setCurrentNote = this.setCurrentNote.bind(this);
      this.setCurrentNotebook = this.setCurrentNotebook.bind(this);
      this.onChangeFilterText = this.onChangeFilterText.bind(this);
      this.notebookUpdated = this.notebookUpdated.bind(this);
      this.state = {
          filterText:'',
          notes:[],
          notebooks:[],
          currentNote:'',
          currentNotebook:'Default'
      }

  }


  setCurrentNote(id) {
    this.setState({currentNote:id})
  }
  setCurrentNotebook(e, {value}) {
    this.setState({currentNotebook:value})
    this.notebookUpdated(value);
  }
  setDefaultCurrentNotebook = () => {
    this.setState({currentNotebook:"Default"})
    this.notebookUpdated("Default");
  }

  onChangeFilterText(e) {
      this.setState({
          filterText: e.target.value.toLowerCase()
      });
  }

  createNewNote(e) {
    //Make an API call to create a document in mongo
    //Get document id & use it as id for this new entry
    var note = {
      title:'Untitled',
      description:'',
      content:{}
    }
    NoteService
    .addNote(note.title, note.description, note.content, this.props.currentUserObj.user_email, this.state.currentNotebook)
    .then(newNote => {
        NoteService
            .listNotes(this.props.currentUserObj.user_email, this.state.currentNotebook)
            .then(notes => {
                this.setState({notes});
                this.setCurrentNote(newNote.id);
            })
            .catch(error => console.log(error));
    })
    .catch(error => {
        console.log(error);
    });

  }

  createNewNotebook(name) {
    //Make an API call to create a document in mongo
    //Get document id & use it as id for this new entry
    this.state.notebooks.push({
                              key:name,
                              value:name,
                              text:name
                              })
    this.setState({
      currentNotebook:name
    });
    this.notebookUpdated(name);
    NoteService
        .addNotebook(this.props.currentUserObj.user_email, name)
        .then(rsp => {
          const notebooks = rsp.map((element,i)=>{
            return {
              key:dditems.length+1+i,
              value:element,
              text:element
            }
          });

          this.setState({notebooks});
          return;
        })
        .catch(error => {
            console.log(error);
            return;
        });

  }

  onSelectRemove = (id) => {
    NoteService
              .removeNote(id)
              .then((rsp)=>{
                if (rsp.data.status === 'Success'){
                  //Update state.
                  NoteService
                      .listNotes(this.props.currentUserObj.user_email, this.state.currentNotebook)
                      .then(notes => {
                          if (id === this.state.currentNote){
                            this.setState({
                              notes:notes,
                              currentNote:''
                            });
                          } else {
                            this.setState({notes});
                            }

                          return;
                      })
                      .catch(error => {
                          console.log('Error in getting notes %o',error);
                          return;
                      })

                }
              })
  }


  notebookUpdated = (name) => {
    NoteService
        .listNotes(this.props.currentUserObj.user_email, name)
        .then(notes => {
            this.setState({notes});
            return;
        })
        .catch(error => {
            console.log(error);
            return;
        });
  }


  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    console.log("Compnent did update with %o", prevProps);
    if(!this.props.isSignedIn){
      prevProps.history.push('/login')
      }
  }

  componentDidMount() {
    console.log("Mounting with signed in value as %o", this.props.isSignedIn);
    if (this.props.isSignedIn){
    NoteService
        .getNotebooks(this.props.currentUserObj.user_email)
        .then(rsp => {
          const notebooks = rsp.map((element,i)=>{
            return {
              key:dditems.length+1+i,
              value:element,
              text:element
            }
          });
            this.setState({notebooks});

        })
        .catch(error => {
            console.log("Error in getting notebooks %o",error);
            return;
        })
    NoteService
        .listNotes(this.props.currentUserObj.user_email, this.state.currentNotebook)
        .then(notes => {
            this.setState({notes});
            return;
        })
        .catch(error => {
            console.log('Error in getting notes %o',error);
            return;
        })

      }

  }

  renderNoteEditor = () =>{
    const currentNote=this.getCurrentNote();
    console.log("Current Note received is %o", currentNote);
    if (currentNote){
    return (
      <NoteEdit note={currentNote} handleSave={this.handleSave}/>
    )
    }
  }

  selectNote(id) {
    this.setCurrentNote(id)
    var note = this.state.notes.find(note => {return note._id === id});
    note.updated = Date.now();

  }

  getCurrentNote = () => {
    console.log("Current NOte id is %o ", this.state.currentNote);
    const note= this.state.notes.find(element => {return element._id === this.state.currentNote});
    console.log("returning current note %o & length of notes is ", note, this.state.notes.length);
    return note;
  }

  handleSave = () => {
    console.log("Note Updated");
        NoteService
            .listNotes(this.props.currentUserObj.user_email, this.state.currentNotebook)
            .then(notes => {
                this.setState({notes});
                return;
            })
            .catch(error => console.log(error));
  }


  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }


  notesList(filterText) {

    let counter =0;
    this.state.notes.sort(function(a,b){
      var dateA=new Date(a.updated), dateB=new Date(b.updated)
      return dateB - dateA;
    });
      return this.state.notes.map((currentNote, i) => {

          if (currentNote.description.toLowerCase().indexOf(filterText) !== -1) {
            counter=counter+1;
            currentNote.counter = counter;
          return <Notes onNoteSelect={this.selectNote} onSelectRemove={this.onSelectRemove} value={currentNote._id} note={currentNote} key={i} />;
        }
      })
  }

  onChange = (editorState) => this.setState({editorState});

  renderCreateFirstNote = () => {
    if (this.state.notes.length === 0){
      return (<Segment placeholder>
        <Header icon>
          <Icon name='pdf file outline'/>
          No notes are listed under this Notebook.
        </Header>
        <Button primary onClick={this.createNewNote}>Create First Note</Button>
      </Segment>);
    }
  }

 renderNoteDisplay = () => {
   if (this.state.notes.length > 0){
     return (
       <div className='ui container'>
         <Grid container stretched columns={2}>
           <Grid.Column>
              <List divided selection verticalAlign='middle'>
                       {this.notesList(this.state.filterText)}
              </List>
           </Grid.Column>
           <Grid.Column>
                     {this.renderNoteEditor()}
           </Grid.Column>
          </Grid>

        </div>
      )

   }
 }

render() {
  return (

  <div className="ui container">

    {this.props.isSignedIn === null ? (
      <div>
      <Redirect to ='/login'/>
      </div>
    ) : (
      <div>
    <Divider hidden/>
    <div>
      <Container textAlign='right'>
        <Grid columns={4} stackable textAlign='right'>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column width={2}>
              <h3>Notebook:</h3>
            </Grid.Column>
            <Grid.Column width={2}>

              <Dropdown placeholder={this.state.currentNotebook} selection options={dditems.concat(this.state.notebooks)} value={this.state.currentNotebook} onChange={this.setCurrentNotebook}/> {this.state.currentNotebook === 'Create' && (<NotebookCreate createNewNotebook={(value) => this.createNewNotebook(value)} setCurrentNotebook={() => this.setDefaultCurrentNotebook()}/>)}
            </Grid.Column>
            <Grid.Column width={8}>

              <Input placeholder="Search Notes..." icon={{
                  name: 'search',
                  circular: true,
                  link: true
                }} value={this.state.filterText} onChange={this.onChangeFilterText}/>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button className="ui icon button" onClick={this.createNewNote}>
                <Icon className="plus" size='large'/>
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

      </Container>
    </div>
    <Divider hidden/>
    <div className='ui equal height stretched'>
      { this.renderCreateFirstNote()}
      { this.renderNoteDisplay()}
    </div>
  </div>
      )}
  </div>)}

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
)(NoteManager);
