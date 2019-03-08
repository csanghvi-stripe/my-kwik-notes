//{id:1, title:"first test", description:"my content", content:{}},{id:2, title:"Second test", description:"my content", content:{}},{id:3, title:"Third test", description:"my content", content:{}}
import React from 'react'
import Moment from 'react-moment';

import ReactDOM from 'react-dom';
import { EditorState, ContentState } from 'draft-js';
import { Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import {Form, Modal,Dropdown, Menu, Header, Input, Icon, Container, Button, Divider, Grid, Image, Segment, List } from 'semantic-ui-react'
import { convertFromRaw, convertToRaw } from 'draft-js';
import NoteRemove from './NoteRemove';
import CreateNotebook from './CreateNotebook';

const NoteService = require('../../api/NoteServices');



const dditems = [
{ key: 1, text: 'Default', value: 1 },
{ key: 2, text: 'All', value: 2 },
{ key: 3, text: 'Test', value: 3 },
]



const Notes = props => {
  console.log(props);
  return (
  <List.Item id={props.note._id} as='a' value={props.note._id} onClick={() => {props.onNoteSelect(props.note._id)}}>
      <List.Content>

        <Grid columns={2} stackable>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
            <List.Header>{props.note.title}
              </List.Header>
            </Grid.Column>
            <Grid.Column>
              <List.Header>
                <NoteRemove/>
              </List.Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <br/>
        <List.Description size='small'>
        {props.note.description}
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



class NoteBuild extends React.Component {
  constructor(props) {
      super(props);
      this.selectNote = this.selectNote.bind(this);
      this.notesList = this.notesList.bind(this);
      this.createNewNote = this.createNewNote.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.setCurrentNote = this.setCurrentNote.bind(this);
      this.setCurrentNotebook = this.setCurrentNotebook.bind(this);
      this.onTitleChange = this.onTitleChange.bind(this);
      this.onChangeFilterText = this.onChangeFilterText.bind(this);
      this.deleteNoteAction = this.deleteNoteAction.bind(this);
      this.state = {
          comment:'',
          filterText:'',
          notes:[],
          notebooks:[],
          editorState: EditorState.createEmpty(),
          currentNote:'',
          currentNotebook:'',
          title:''
      }

  }

  setCurrentNote(id) {
    this.setState({currentNote:id})
  }
  setCurrentNotebook(e, {value}) {
    console.log('notebook selected', value);
    this.setState({currentNotebook:value})
    if (this.state.currentNotebook == 'create'){

    }
  }
  onTitleChange(e){
    console.log("Title is %s", e.target.value);
    this.setState({title:e.target.value});
  }

  onChangeFilterText(e) {
      this.setState({
          filterText: e.target.value.toLowerCase()
      });
  }

  createNewNote(e) {
    console.log("Tine to create new content %o", e.target);
    //Make an API call to create a document in mongo
    //Get document id & use it as id for this new entry
    var note = {
      title:'Untitled',
      description:'',
      content:{}
    }
    NoteService
    .addNote(note.title, note.description, note.content)
    .then(newNote => {
      console.log("Created nore notes are %o", newNote);
        NoteService
            .listNotes()
            .then(notes => {
              console.log("Received notes are %o", notes);
                this.setState({notes});
                this.setCurrentNote(newNote.id);
                this.setState({title:''});
                this.setState({ editorState: EditorState.createEmpty()});
            })
            .catch(error => console.log(error));
    })
    .catch(error => {
        console.log(error);
    });

  }

  deleteNoteAction(e){
    console.log("Render Modal");
    return (
        <NoteRemove/>
      );
  }

  setEditorContent (text, contentData) {
    if (contentData.hasOwnProperty("blocks")){
      /*
      const contentState = ContentState.createFromBlockArray(contentData.blocks, contentData.entityMap);
      const editorState = EditorState.push(this.state.editorState, contentState);
      this.setState({ editorState});
     */
      console.log("Content data is %o", contentData);
       const content  = convertFromRaw(contentData);
       this.setState({editorState: EditorState.createWithContent(content)});

    } else {
       const contentState = ContentState.createFromText(text);

      const editorState = EditorState.push(this.state.editorState, contentState);
      this.setState({ editorState});
    }
  }

  componentDidMount() {
    NoteService
        .listNotes()
        .then(notes => {
            this.setState({notes});
            return;
        })
        .catch(error => {
            console.log(error);
            return;
        });
  }


  selectNote(id) {
    console.log("Note selected %o", id);
    this.setCurrentNote(id)
    var note = this.state.notes.find(note => {return note._id === id});
    console.log(note);
    note.updated = Date.now();
    this.setEditorContent(note.description, JSON.parse(note.content));
    this.setState({title:note.title});

  }

  handleSubmit = (e) => {
    e.preventDefault();
    var {editorState} = this.state;
    var convertedData = convertToRaw(this.state.editorState.getCurrentContent())
    console.log("Converted data is %o", convertedData);
    console.log("Current note is %o", this.state.currentNote);
    var note = {}
    this.state.notes.map((currentNote, i) => {
          if (currentNote._id === this.state.currentNote){
              note = {
                content: JSON.stringify(convertedData),
                description:this.state.editorState
                                      .getCurrentContent()
                                      .getPlainText(),
                title: this.state.title,
                _id:this.state.currentNote
              }

          }
    })

    NoteService
    .updateNote(note)
    .then(() => {
        NoteService
            .listNotes()
            .then(notes => {
                this.setState({notes});
            })
            .catch(error => console.log(error));
    })
    .catch(error => {
        console.log(error);
    });
//    this.setState({editorState: EditorState.createEmpty()});
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
          return <Notes onNoteSelect={this.selectNote} onSelectDelete={this.deleteNoteAction} value={currentNote._id} note={currentNote} key={i} />;
        }
      })
  }

  onChange = (editorState) => this.setState({editorState});

render() {
  return (
    <div className="ui container">
    <Divider hidden/>
    <div>
    <Container textAlign='right'>
    <Grid columns={4} stackable textAlign='right'>
      <Grid.Row verticalAlign='middle'>
        <Grid.Column width = {2}>
          <h3>Notebook:</h3>
        </Grid.Column>
        <Grid.Column width = {2}>

          <Dropdown placeholder='Choose a Notebook'
            selection
             options={[
          { key: 1, text: 'Default', value: 1 },
          { key: 2, text: 'All', value: 2 },
          { key: 3, text: 'create', value: 3 }
        ]} value={this.state.currentNotebook} onChange={this.setCurrentNotebook}/>
      {this.state.currentNotebook === 3 && (
      <CreateNotebook/>
      )}
        </Grid.Column>
        <Grid.Column width = {8}>

          <Input placeholder="Search Notes..." icon={{ name: 'search', circular: true, link: true }} value={this.state.filterText} onChange={this.onChangeFilterText}/>
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
    <div>
    {this.state.notes.length === 0 ? (
    <Segment placeholder>
      <Header icon>
        <Icon name='pdf file outline' />
        No documents are listed for this customer.
      </Header>
      <Button primary onClick={this.createNewNote}>Create First Note</Button>
    </Segment>
  ) : (

  <div className='ui Container'>
    <Grid columns={2} relaxed='very'>
      <Grid.Column>
      <List divided selection verticalAlign='middle'>
        { this.notesList(this.state.filterText) }
      </List>
      </Grid.Column>
      <Grid.Column>
      <div>
          <div id="comment-form-div">
            <Form name="title" placeholder="Title" autoFocus value={this.state.title} onChange={this.onTitleChange} >
              <Form.Field>
                <label>Title</label>
                <input placeholder='Title' />
              </Form.Field>
            </Form>
            <Editor
              editorState={this.state.editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="editer-content"
              placeholder="Enter some note..."
              onEditorStateChange={this.onChange}
              toolbar={{
                options: ['inline', 'colorPicker', 'link', 'emoji', 'image'],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            />
          </div>
          <div id="comment-button-div">
            <Button onClick={this.handleSubmit} id="comment-submit-button" color="teal">Save</Button>
          </div>
      </div>
      </Grid.Column>
    </Grid>


  </div>
  )}
  </div>
  </div>
)
}
}
export default NoteBuild
