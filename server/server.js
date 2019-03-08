const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const notesRoutes = express.Router();
const userRoutes = express.Router();
const notebooksRoutes = express.Router();
const mongoose = require('mongoose');


const PORT = 4000;
const formidable = require('formidable');


const Notes = require('./data.model');
mongoose.connect('mongodb://127.0.0.1:27017/notes', {
  useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once('open', function() {
  console.log("MongoDB database connection established successfully");
})

connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(bodyParser.json());


// get all the notes
Notes.find({}, function(err, notes) {
  if (err) throw err;

  // object of all the users
  console.log(notes);
});


notesRoutes.route('/').get(function(req, res) {
  console.log("received a req to list %o", req.query.user);
  Notes.find({user:req.query.user},function(err, note) {
    if (err) {
      console.log(err);
    } else {
      console.log("responding with ", note);
      res.json(note);
    }
  });
});

notesRoutes.route('/:id').get(function(req, res) {
  let id = req.params.id;

  Notes.findById(id, function(err, note) {
    res.json(note);
  });
});


notebooksRoutes.route('/add').post(function(req, res) {
  console.log("received a req to add Notebook");
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    var body = JSON.parse(fields.notebook);
    console.log("Add Notes body is %o", body)
    var user = JSON.parse(fields.user);
    console.log("Add Notes body is %o", user)
    Users.update({
      _id: user
    },
      { $push: { notebooks: body } }
    )
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

notesRoutes.route('/add').post(function(req, res) {
  console.log("received a req to add");
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    var body = JSON.parse(fields.note);
    console.log("Add Notes body is %o", body)
    var user = JSON.parse(fields.user);
    console.log("Add Notes body is %o", body)

    let note = new Notes(body);
    note.user = user;
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



app.use('/api/v1/notes', notesRoutes);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/notebooks', notebooksRoutes);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
