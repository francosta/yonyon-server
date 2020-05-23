require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const Question = mongoose.model('Question');
const router = express.Router();

// Get all questions
router.get('/questions', auth, async (req, res) => {
  try {
    const questions = await Question.find({});

    res.status(200).send(questions);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
