import React from 'react'
import { Button } from 'semantic-ui-react'

import { EditorState } from 'draft-js';
import { Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import './NoteBuild.css'

class NoteBuild extends React.Component {
  state ={
      comment:'',
      editorState: EditorState.createEmpty()
  }


  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({editorState: EditorState.createEmpty()})
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onChange = (editorState) => this.setState({editorState});

  render() {
    return(
      <div>
          <div id="comment-form-div">
              <div className="form-group">
                  <input type="text" className="form-control" name="title" placeholder="Title" autoFocus onChange={this.onTitleChange} />
              </div>
            <Editor
              editorState={this.state.editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="editer-content"
              // toolbarClassName="toolbar-class"
              onEditorStateChange={this.onChange}
              toolbar={{
                options: ['inline', 'list','colorPicker', 'link', 'emoji', 'image'],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            />
          </div>
          <div id="comment-button-div">
            <Button onClick={this.handleSubmit} id="comment-submit-button" color="teal">Submit</Button>
          </div>
      </div>
    )
  }
}



export default NoteBuild;
