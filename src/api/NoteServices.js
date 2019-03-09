'use strict';


// package references


const axios =require('axios');


// db options


const baseApiUrl = 'http://localhost:4000/api/v1/notes';
const userApiUrl = 'http://localhost:4000/api/v1/users';


const addNotebook = (user_email, notebook) => {

    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('user_email',JSON.stringify(user_email));
      data.append('notebook',JSON.stringify(notebook));
        axios
            .post(`${userApiUrl}/addnotebook`, data)
            .then((result) => {
                resolve(result.data);
            })
            .catch(error => {
                console.log(error);
                reject(error.message);
            });

    });

};

const getNotebooks = (user_email) => {

    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('user_email',JSON.stringify(user_email));
        axios
            .post(`${userApiUrl}/getnotebooks`, data)
            .then((result) => {
                resolve(result.data);
            })
            .catch(error => {
                console.log(error);
                reject(error.message);
            });

    });

};

// add note

const addNote = (title, description, content, user_email, notebook, tags = []) => {

    return new Promise((resolve, reject) => {
      const data = new FormData();
      const note = {
        title: title,
        description: description,
        content: JSON.stringify(content),
        tags: tags.join()
      }
      data.append('note',JSON.stringify(note));
      data.append('user_email',JSON.stringify(user_email));
      data.append('notebook',JSON.stringify(notebook));
      console.log("Requesting to create for user with %o", user_email)
        axios
            .post(`${baseApiUrl}/add`, data)
            .then((result) => {
                resolve(result.data);
            })
            .catch(error => {
                console.log(error);
                reject(error.message);
            });

    });

};


// find notes


const findNote = (id) => {

    return new Promise((resolve, reject) => {
        axios
            .get(`${baseApiUrl}/${id}`)
            .then(response => {
                resolve(response.data);
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });

};


const findNotesByTitle = (title) => {

    return new Promise((resolve, reject) => {
        axios
            .get(`${baseApiUrl}/notes?title=${title}`)
            .then(response => {
                resolve(response.data);
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });

};

const listNotes = (user_email, notebook) => {

    return new Promise((resolve, reject) => {
        axios
            .get(`${baseApiUrl}?user_email=${user_email}&notebook=${notebook}`)
            .then(response => {
                resolve(response.data);
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });

};


// remove note


const removeNote = (id) => {

    return new Promise((resolve, reject) => {
        axios
            .delete(`${baseApiUrl}/notes/${id}`)
            .then(() => {
                resolve();
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });

};


// update note


const updateNote = (note) => {
  console.log("Note is %o", note);
  const data = new FormData();

  data.append('note',JSON.stringify(note));
  data.append('user',1);
  //TODO: Update with user id

    return new Promise((resolve, reject) => {
        axios
            .post(`${baseApiUrl}/update/${note._id}`, data)
            .then(() => {
                resolve();
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });

};



const login = (userToken) => {
  console.log("User is %o", userToken);
  const data = new FormData();

  data.append('token',userToken);
  //TODO: Update with user id
  console.log("Data sending is %o", data.token);

    return new Promise((resolve, reject) => {
        axios
            .post(`${userApiUrl}/login`, data)
            .then((rsp) => {
              console.log(rsp);
                resolve(rsp);
                return;
            })
            .catch(error => {
              console.log(error);
                reject(error.message);
                return;
            });
    });

};


// exports


module.exports = {
    'login': login,
    'addNote': addNote,
    'findNote': findNote,
    'listNotes': listNotes,
    'updateNote': updateNote,
    'addNotebook':addNotebook,
    'getNotebooks':getNotebooks
};
