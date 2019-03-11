//<Dropdown.Item> <Link to={`/notes/${this.props.currentNote}`} className='ui edit icon'> Open</Link></Dropdown.Item>

import React from 'react';
import Modal from '../Modal';
import {Dropdown} from 'semantic-ui-react'
import { Link } from 'react-router-dom';


class NoteOptions extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      show:false
    }
  }

  setShow = () => {
    this.setState({
      show:true
    })
  }
  unSetShow() {
    this.setState({
      show:false
    })
  }

  deleteNote(){
    console.log("Delete note with id %o", this.props.currentNote);
    this.props.onSelectRemove(this.props.currentNote)

    this.setState({
      show:false
    })

  }

  renderActions() {
    return (
      <React.Fragment>
        <button
          onClick={() => this.deleteNote()}
          className="ui button negative"
        >
          Delete
        </button>
        <button
          onClick={() => this.unSetShow()}
          className="ui button negative"
        >
          Cancel
        </button>
      </React.Fragment>
    );
  }

  renderContent() {
      return 'Are you sure you want to delete this note?';
  }




  render() {
    return (

      <div className="right floated content">
        <Dropdown icon='setting' floating button className='icon'>
          <Dropdown.Menu>
            <Dropdown.Item icon='trash' text='Delete' onClick={this.setShow}/>
            <Dropdown.Item icon='share alternate' text='Share'/>
            <Dropdown.Item icon='exchange' text='Change Notebook'/>
            <Dropdown.Item icon='edit' text='Edit'/>
          </Dropdown.Menu>
        </Dropdown>
      {this.state.show === true && (
        <Modal
          title="Delete Note"
          content={this.renderContent()}
          actions={this.renderActions()}
          onDismiss={() => this.unSetShow()}
        />
      )}
    </div>

    );
  }
}

export default NoteOptions;