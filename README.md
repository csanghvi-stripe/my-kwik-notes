# Simple Note Taking App using MERN Stack

### Solution Description
This project shows how to build a simple note app using Mongo, React, Express & Nodejs.
It uses wysiwyg draft editor from here: https://github.com/jpuri/react-draft-wysiwyg

####Server
##API
Server exposes below API endpoints that are protected using JSON Web Token:
1.  Below APIs are meant to update notes
GET: /api/v1/notes/, DELETE:/api/v1/notes/delete/:id, POST: /api/v1/notes/add, GET: /api/v1/notes/:id, UPDATE: /api/v1/notes/update/:id
2.  Below APIs are meant to access notebooks which is stored at User level  
GET: /api/v1/users/getnotebooks, POST: /api/v1/users/addNotebook
3. Unprotected route: Login. Browser sends user token from Google Auth, this endpoint receives the token & verifies it using OAuth2Client library. Once a user is verified, a user entry is created in DB & a JSON web token is generated using payload of userObj & sent back to the client.  

##Data Model:
Application uses MongoDB. There are two primary collections:
1.  User: User information (credentials) along with notebooks a user has created. Also, there is an array of all shared notes for this user.
2.  Notes: Each Note has a title, content (wysywig draft editer) & description (plain text content). Additionally, notebook field to denote which notebook it belongs to.

##Client
1.  This project was bootstrapped with Create React App.
Client uses REACT components to add, delete, update, list Notes.
2.  It also uses Redux for state management & stores whether a user is signedIn & UserObj
3.  All notes can be organized within notebooks. Be default a user has a "default" notebook. Users can create additional notebooks and also change notebook of a note.
4.  Below React routes are supported:
"/" component={NoteManager} />
<Route exact path="/login" component={Login} />
<Route path="/notes/edit/:id" component={NoteEdit} />
<Route exact path="/notes/manage" component={NoteManager} />
<Route exact path="/notes/list" component={NotebookList} />
