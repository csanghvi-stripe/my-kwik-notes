var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QBank = new Schema({
    updated: { type: Date, default: Date.now },
    createdBy: {type: String},
    question: {type: String, required: true},
    answer: {type: String, required: true},
    keyword: { type: [String], index: true, text: true, required:true },
    attachments: { type: String}
});


var UserQuestions = new Schema({
    updated: { type: Date, default: Date.now },
    askedBy: {type: String, required:true},
    question: {type: String, required: true},
    answer: {type: String},
    helpful: {type: Boolean}
});

var Responses = new Schema({
    updated: { type: Date, default: Date.now },
    response: {type: String, required: true},
    keyword: { type: [String], index: true, text: true, required:true },
    helpful: {type: Boolean}
});


// Export the model
module.exports = [mongoose.model('QBank', QBank), mongoose.model('UserQuestions', UserQuestions), mongoose.model('Responses', Responses)]
