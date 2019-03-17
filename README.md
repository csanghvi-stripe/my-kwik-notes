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

##Data Model:
Application uses MongoDB. There are two primary collections:
1.  User: With user information along with notebooks with a user. Also, there is an array of all shared notes for this user.
2.  Notes:  
