const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: {
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
