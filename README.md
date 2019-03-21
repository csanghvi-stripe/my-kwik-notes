# Simple Note Taking App using MERN Stack

### Solution Description
This project shows how to build a simple note app using Mongo, React, Express & Nodejs.
It uses wysiwyg draft editor from here: https://github.com/jpuri/react-draft-wysiwyg

### APIs

Server exposes below API endpoints that are **protected** using JSON Web Token:

|                |Notes                          |Notebooks                         |
|----------------|-------------------------------|-----------------------------|
|Add             |Post `/api/v1/notes/add`       | Post `/api/v1/users/addnotebooks` |
|Get             |Get `/api/v1/notes/`           |Get `/api/v1/users/getnotebooks`  |
|Delete          |Delete `/api/v1/notes/delete/:id`     ||
|Update          |Post/Put `/api/v1/notes/update/:id`     ||
|Delete          |`/api/v1/notes/delete/:id`     ||
|Delete          |`/api/v1/notes/delete/:id`     ||

**Unprotected route: /login** Browser sends user token from Google Auth, this endpoint receives the token & verifies it using OAuth2Client library. Once a user is verified, a user entry is created in DB & a JSON web token is generated using payload of userObj & sent back to the client.  

### Data Model:
Application uses MongoDB. There are two primary collections:
1.  User: User information (credentials) along with notebooks a user has created. Also, there is an array of all shared notes for this user.
2.  Notes: Each Note has a title, content (wysywig draft editer) & description (plain text content). Additionally, notebook field to denote which notebook it belongs to.
After denormalization Notes collection also holds additional context of users with whom notes was shared.

### Client
1.  This project was bootstrapped with Create React App.
Client uses REACT components to add, delete, update, list Notes.
2.  It also uses Redux for state management & stores whether a user is signedIn alongwith the UserObj
3.  All notes can be organized within notebooks. By default a user has a "default" notebook. Users can create additional notebooks and also change notebook of a note.

### Special Libraries uses:
-  *google-auth-library* for Google Oauth 2.0 Authentication
-  *react-draft-wysiwyg* for implementing WYSYWIG note editer.
-  *jsonwebtoken* for implementing authentication using Json web tokens


### Hosting
You can find this app at https://kwik-notes.com. Its hosted on a digital ocean droplet & uses LetsEncrypt certificates for SSL termination.
App server is proxied behind NGINX webserver.

