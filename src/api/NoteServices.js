'use strict';


// package references


const axios =require('axios');


// db options


const baseApiUrl = 'http://localhost:4000/api/v1/notes';


// add note

const addNote = (title, description, content, tags = []) => {

    return new Promise((resolve, reject) => {
      const data = new FormData();
      const note = {
        title: title,
        description: description,
        content: JSON.stringify(content),
        tags: tags.join()
      }
      data.append('note',JSON.stringify(note));
      data.append('user',1);
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

const listNotes = () => {

    return new Promise((resolve, reject) => {
        axios
            .get(`${baseApiUrl}?user=1`)
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


// exports


module.exports = {
    'addNote': addNote,
    'findNote': findNote,
    'listNotes': listNotes,
    'updateNote': updateNote
};
