
// package references


const axios =require('axios');


const axiosApi = axios.create({
   baseURL: (process.env.REACT_APP_BASE_URL !== undefined) ? process.env.REACT_APP_BASE_URL : 'http://localhost:4000/api/v1/'
 })

axiosApi.interceptors.request.use(
  (config) => {
    let token = sessionStorage.getItem('jwt');


    if (token) {
      config.headers['Authorization'] = `Bearer ${ token }`;
    }

    return config;
  },

  (error) => {
    console.log("Error in setting header %o", error);
    return Promise.reject(error);
  }
);

// db options





const addNotebook = (user_email, notebook) => {

    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('user_email',JSON.stringify(user_email));
      data.append('notebook',JSON.stringify(notebook));
        axiosApi
            .post(`users/addnotebook`, data)
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
        axiosApi
            .post('users/getnotebooks', data)
            .then((result) => {
                resolve(result.data);
            })
            .catch((error) => {
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
        axiosApi
            .post(`notes/add`, data)
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
        axiosApi
            .get(`notes/${id}`)
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
        axiosApi
            .get(`notes?user_email=${user_email}&notebook=${notebook}`)
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
        axiosApi
            .delete(`notes/delete/${id}`)
            .then((rsp) => {
                resolve(rsp);
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
        axiosApi
            .post(`notes/update/${note._id}`, data)
            .then((rsp) => {
                resolve(rsp);
                return;
            })
            .catch(error => {
                reject(error.message);
                return;
            });
    });

};



const login = (userToken) => {
  const data = new FormData();

  data.append('token',userToken);

    return new Promise((resolve, reject) => {
        axios
            .post(`${process.env.REACT_APP_LOGIN_URL}`, data)
            .then((rsp) => {
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
    'removeNote': removeNote,
    'addNotebook':addNotebook,
    'getNotebooks':getNotebooks
};
