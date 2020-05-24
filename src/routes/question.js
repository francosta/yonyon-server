require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const Question = mongoose.model('Question');
const router = express.Router();

// Get all questions
router.get('/questions', auth, async (req, res) => {
  try {
    const questions = await Question.find({}).populate('author');

    res.status(200).send(questions);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create question
router.post('/questions', auth, async (req, res) => {
  const user = req.user;
  const question = new Question({ ...req.body, author: user._id });

  try {
    await question.save();
    await user.questions.push(question._id);
    await user.save();
    res.status(201).send(question);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Answer question
router.patch('/questions/:id', auth, async (req, res) => {
  const { answer } = req.body;
  const { user } = req;

  try {
    const question = await Question.findById(req.params.id);
    if (answer === true) {
      question.answers.yes = question.answers.yes + 1;
      await question.save();
      user.answers.yes.push(question._id);
      await user.save();
    } else {
      question.answers.no = question.answers.no + 1;
      await question.save();
      user.answers.no.push(question._id);
      await user.save();
    }
    res.status(200).send(question);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
