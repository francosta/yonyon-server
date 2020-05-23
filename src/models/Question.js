const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  answers: { yes: [Number], no: [Number] },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
