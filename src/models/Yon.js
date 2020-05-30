const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  answer: {
    type: Boolean,
  },
});

const yonSchema = new mongoose.Schema({
  yon: {
    type: String,
    required: true,
  },
  answers: answerSchema,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Yon = mongoose.model('Yon', yonSchema);

module.exports = Yon;
