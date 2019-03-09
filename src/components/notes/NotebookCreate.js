import React from 'react';
import { Link } from 'react-router-dom';
import Modal from '../Modal';
import {Form, Dropdown, Input} from 'semantic-ui-react'


class NotebookCreate extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      show:true,
      name:''
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

  onNameShow = (e)=>{
    this.setState({
      name:e.target.value
    })
  }

  createNotebook(){
    console.log("Create notebook with name %o", this.state.name);


    this.setState({
      show:false
    });
    this.props.createNewNotebook(this.state.name);

  }

  onNotebookChange = (e) =>{
    console.log("Notebook name is %s", e.target.value);
    this.setState({name:e.target.value});
  }

  renderActions() {
    return (
      <React.Fragment>
        <Form name="title">
          <Form.Field>
            <Input placeholder="Notebook Name" value={this.state.name} onChange={this.onNotebookChange}/>
          </Form.Field>
        </Form>
        <br/>
        <button
          onClick={() => this.createNotebook()}
          className="ui button positive"
        >
          Save
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
      return 'Provide a name for the new notebook';
  }


  render() {
    return (

      <div>
      {this.state.show === true && (
        <Modal
          title="Create Notebook"
          content={this.renderContent()}
          actions={this.renderActions()}
          onDismiss={() => this.unSetShow()}
        />
      )}
    </div>

    );
  }
}

export default NotebookCreate;
