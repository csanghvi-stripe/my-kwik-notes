import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Dropdown} from "semantic-ui-react";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    color: 'lightsteelblue',
    opacity:1
  },
  overlay: {
    backgroundColor: 'papayawhip',
    opacity:1
  }
};

function validate(notebook) {
  // we are going to store errors for all fields
  // in a signle array
  const errors = [];

  if (notebook.length === 0) {
    errors.push("notebook can't be empty");
  }
  return errors;
}


// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(document.getElementById('root'));

export default class CreateNotebook extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: true,
      notebook:'',
      errors: []
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChangeNotebook = this.onChangeNotebook.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangeNotebook(e) {
      this.setState({
          notebook: e.target.value
      });
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }



  closeModal() {
    this.setState({modalIsOpen: false});
  }

  onSubmit(e) {
      e.preventDefault();
      console.log("Create a notebook with name %o under user %o", this.state.notebook);
      const errors = validate(this.state.notebook);
      if (errors.length > 0) {
        this.setState({
          errors
        });
        return;
      }

      this.setState({
        notebook:'',
        modalIsOpen: false
      })
    }


  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h2>Create Notebook</h2>
          <button onClick={this.closeModal}>close</button>
          <form onSubmit={this.onSubmit}>
          {this.state.errors.map(error => (
            <p> <strong><font color='red' size="3" key={error}>Error: {error} </font></strong></p>
          ))}
          <input  type="text"
            className="form-control"
            value={this.state.notebook}
            onChange={this.onChangeNotebook}
            />
            <button>Create</button>
          </form>
        </Modal>
      </div>
    );
  }
}
