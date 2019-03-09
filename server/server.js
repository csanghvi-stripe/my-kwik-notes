const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const notesRoutes = express.Router();
const usersRoutes = express.Router();
const notebooksRoutes = express.Router();
const mongoose = require('mongoose');


const PORT = 4000;
const formidable = require('formidable');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('370698994318-k21ec6kug4arcs8pfe67r9jhct5piemv.apps.googleusercontent.com');
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "370698994318-k21ec6kug4arcs8pfe67r9jhct5piemv.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userObj = {
    user_id:payload['sub'],
    user_email:payload['email'],
    given_name: payload['given_name'],
    family_name:payload['family_name']
  }
  return userObj;
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}



[Notes, Users] = require('./data.model');
mongoose.connect('mongodb://127.0.0.1:27017/notes', {
  useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once('open', function() {
  console.log("MongoDB database connection established successfully");
})

connection.on('error', console.error.bind(console, 'MongoDB connection error:'));




notesRoutes.route('/').get(function(req, res) {
  console.log("received a req to list %o & %o", req.query.user_email, req.query.notebook);
  if (req.query.notebook === 'All') {
    Notes.find({
      user_email: req.query.user_email
    }, function(err, note) {
      if (err) {
        console.log(err);
      } else {
        console.log("responding with ", note);
        res.json(note);
      }
    });
  } else {
    Notes.find({
      user_email: req.query.user_email,
      notebook: req.query.notebook
    }, function(err, note) {
      if (err) {
        console.log(err);
      } else {
        console.log("responding with ", note);
        res.json(note);
      }
    });
  }
});


usersRoutes.route('/login').post(async function(req, res) {
  console.log("Received Login Req");
  new formidable.IncomingForm().parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    try {
      console.log("fields is %o", fields.token);
      //var token = JSON.parse(fields.token);
      //Lets first validate this request.

      const userObj = await verify(fields.token);
      //Lets create a new user in DB if does not exit
      console.log(userObj);
      //res.json(userObj);
      Users.findOne({user_id:userObj.user_id}, function(err, user) {
        if (!user){
          //Create a user in Database;

          let new_user = new Users(userObj);
          new_user.notebooks.push("Default");
          new_user.save()
            .then(n => {
              console.log("status %o", n);
              res.status(200).json(userObj);
            })
            .catch(err => {
              console.log("Failed with err", err);
              res.status(400).send('adding new User failed');
            });
        } else {
          res.status(200).json(userObj);
        }
      });

    } catch (error) {
      console.log("Failed with err", error);
      res.status(400).send(`User Validation Failed ${error}`);
      console.error("Error in validating user credentials %o", error);
    }

  });


});



notesRoutes.route('/:id').get(function(req, res) {
  let id = req.params.id;

  Notes.findById(id, function(err, note) {
    res.json(note);
  });
});


usersRoutes.route('/getnotebooks').post(async function(req, res) {
  console.log("received a req to get Notebooks");
  new formidable.IncomingForm().parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    var user_email = JSON.parse(fields.user_email);
    console.log("Add Notes body is %o", user_email)
    var user = await Users.findOne({user_email:user_email});
    if (!user) {
        //Create a user in Database;
        console.log("User not found");
        res.status(400).send('fetching notebooks failed, user not found');
      } else {
        res.status(200).json(user.notebooks);
      }
    });
});

usersRoutes.route('/addnotebook').post(async function(req, res) {
  console.log("received a req to add Notebook");
  new formidable.IncomingForm().parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    var notebook = JSON.parse(fields.notebook);
    console.log("Add Notes body is %o", notebook)
    var user_email = JSON.parse(fields.user_email);
    console.log("Add Notes body is %o", user_email)
    var user = await Users.findOne({user_email:user_email});
    if (!user) {
        //Create a user in Database;
        console.log("User not found");
        res.status(400).send('Updating notebook failed, user not found');
      } else {
        user.notebooks.push(notebook);
        await user.save();
        res.status(200).json(user.notebooks);
      }
    });
});

notesRoutes.route('/add').post(function(req, res) {
  console.log("received a req to add %o", req.body.user);
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    var body = JSON.parse(fields.note);
    console.log("Add Notes body is %o", body)
    var user_email = JSON.parse(fields.user_email);
    var notebook = JSON.parse(fields.notebook);
    console.log("Add Notes user is %o", user_email)

    let note = new Notes(body);
    note.user_email = user_email;
    note.notebook = notebook;
    note.save()
      .then(n => {
        console.log("status %o", n);
        res.status(200).json({
          'id': `${n._id}`,
          'status': "Success"
        });
      })
      .catch(err => {
        console.log("Failed with err", err);
        res.status(400).send('adding new Note failed');
      });
  })
});

notesRoutes.route('/update/:id').post(function(req, res) {
  console.log("received a req to updat for %o", req.params.id);
  Notes.findById(req.params.id, function(err, note) {
    if (!note)
      res.status(404).send('data is not found');
    else
      new formidable.IncomingForm().parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error', err)
          throw err
        }
        var body = JSON.parse(fields.note)
        console.log("Body is %o", body);

        note.title = body.title;
        note.description = body.description;
        note.content = body.content;
        note.tags = body.tags;
        note.updated = Date.now();

        note.save().then(n => {
            res.json('Notes updated');
          })
          .catch(err => {
            res.status(400).send("Update not possible");
          });
      });
  });
});


app.use(bodyParser.json());
app.use(cors());
app.use('/api/v1/notes', notesRoutes);

app.use('/api/v1/users', usersRoutes);

app.use('/api/v1/notebooks', notebooksRoutes);


app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
