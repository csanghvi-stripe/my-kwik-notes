import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
//import NoteCreate from './components/notes/NoteCreate';
//import NoteEdit from './components/notes/NoteEdit';
//import NoteDelete from './components/notes/NoteDelete';
//import NoteList from './components/notes/NoteList';
//import NoteShow from './components/notes/NoteShow';
import Header from './components/Header';
import SideBar from './components/Sidebar';
import NoteCreate from './components/notes/NoteCreate';
import NoteList from './components/notes/NoteList';
import NoteBuild from './components/notes/NoteBuild';
import NoteManager from './components/notes/NoteManager';
import './App.css';


const Home = () => {
  return (
  <div>Test</div>
  )
}

class App extends Component {
  render() {
    return (
    <div>

      <Router>
        <div>
          <div>
                  <SideBar/>
          </div>
          <div>
          <Header />
          </div>
          <div className="ui container">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/create" component={NoteCreate} />
            <Route path="/list" component={NoteList} />
            <Route path="/build" component={NoteBuild} />
            <Route path="/manage" component={NoteManager} />
          </Switch>
        </div>
      </div>
      </Router>
    </div>
  );
  }
}

export default App;
