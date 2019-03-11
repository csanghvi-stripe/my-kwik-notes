import React from 'react';
import {Form, Button} from 'semantic-ui-react'
import { EditorState, ContentState } from 'draft-js';
import { Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertFromRaw, convertToRaw } from 'draft-js';
const NoteService = require('../../api/NoteServices');


class NoteEdits extends React.Component {
  constructor(props){
    super(props)
    //this.props.note.title
    //this.props.note.setEditorContent
    //this.props.onSubmit => Updated
    this.state = {
      title:'',
      editorState: EditorState.createEmpty(),
    }
    this.onTitleChange = this.onTitleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setEditorContent = this.setEditorContent.bind(this);
  }

  componentDidMount() {
    if (this.props.note){
      this.setState({
        title:this.props.note.title
      })
      this.setEditorContent(this.props.note.description, JSON.parse(this.props.note.content))
    } else{
      //this.props
      console.log(this.props.match.params.id);
      NoteService
      .findNote(this.props.match.params.id)
      .then((rsp) => {
        console.log("received resp upon updateing %o", rsp);
        this.setState({
          title:rsp.title
        })
        this.setEditorContent(rsp.description, JSON.parse(rsp.content))

      })
      .catch(error => {
          console.log(error);
      });
    }

  }
  onTitleChange(e){
    this.setState({title:e.target.value});
  }

  onChange = (editorState) => this.setState({editorState});

  setEditorContent (text, contentData) {
    if (contentData.hasOwnProperty("blocks")){
       const content  = convertFromRaw(contentData);
       this.setState({editorState: EditorState.createWithContent(content)});
    } else {
      const contentState = ContentState.createFromText(text);
      const editorState = EditorState.push(this.state.editorState, contentState);
      this.setState({ editorState});
    }
  }


  handleSubmit = (e) => {
    e.preventDefault();
    var convertedData = convertToRaw(this.state.editorState.getCurrentContent())

    var currentNote = {
        content: JSON.stringify(convertedData),
        description:this.state.editorState
                              .getCurrentContent()
                              .getPlainText(),
        title: this.state.title,
        _id:this.props.note._id
      }
    NoteService
    .updateNote(currentNote)
    .then((rsp) => {
      console.log("received resp upon updateing %o", rsp);
      this.props.handleSave();
    })
    .catch(error => {
        console.log(error);
    });
  }


  render() {
    return (

      <div className='ui equal height stretched'>
        <div>
          <Form name="title">
            <Form.Field>
              <input type='text' placeholder="Title" value={this.state.title} onChange={this.onTitleChange}/>
            </Form.Field>
          </Form>
          <Editor editorState={this.state.editorState}
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                  placeholder="Enter some note..."
                  onEditorStateChange={this.onChange}
                  toolbar={{
                          options: [
                            'inline',
                            'blockType',
                            'fontSize',
                            'colorPicker',
                            'list',
                            'link',
                            'emoji',
                            'image'
                          ],
                          inline: {
                            inDropdown: true
                          },
                          list: {
                            inDropdown: true
                          },
                          link: {
                            inDropdown: true
                          },
                          history: {
                            inDropdown: true
                          }
            }}/>
        </div>
        <div id="comment-button-div" >
          <Button className='ui right floated' onClick={this.handleSubmit} id="comment-submit-button" color="teal">Save</Button>
        </div>
      </div>

    );
  }
}

export default NoteEdits;
