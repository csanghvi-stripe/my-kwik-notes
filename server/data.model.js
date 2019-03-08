var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Notes = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    content: {
        type: String
    },
    tags: {
        type: [String]
    },
    user:{
      type: String
    },
    shared:{
      type:[String]
    },
    updated: { type: Date, default: Date.now },
    notebook:{
      type:[String]
    }
},{ strict: false });

const Users = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    mynotes: {
        type: [String]
    },
    sharednotes: {
        type: [String]
    },
    notebooks:{
      type:[String]
    }
},{ strict: false });

module.exports = mongoose.model('Notes', Notes);//, mongoose.model('Users', Users)}
