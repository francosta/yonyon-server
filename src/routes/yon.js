require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const Yon = mongoose.model('Yon');
const router = express.Router();

// Get all yons
router.get('/yons', auth, async (req, res) => {
  try {
    const yons = await Yon.find({}).populate('author');

    res.status(200).send(yons);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Create yon
router.post('/yons', auth, async (req, res) => {
  const user = req.user;
  const yon = new Yon({ ...req.body, author: user._id });

  try {
    await yon.save();
    await user.createdYons.push(yon._id);
    await user.save();
    res.status(201).send(yon);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Answer yon
router.patch('/yons/:id', auth, async (req, res) => {
  const { answer } = req.body;
  const { user } = req;

  try {
    const yon = await Yon.findById(req.params.id);

    const answeredQuestions = user.submittedAnswers.map((answer) => {
      return answer.yon;
    });

    if (answeredQuestions.includes(yon._id)) {
      return res.status(400).send('This user already answered this question.');
    }

    if (answer === true) {
      yon.answers.push({ userId: user._id, answer: true });
      await yon.save();
      user.submittedAnswers.push({ yon: yon._id, answer: true });
      await user.save();
    } else {
      yon.answers.push({ userId: user._id, answer: false });
      await yon.save();
      user.submittedAnswers.push({ yon: yon._id, answer: false });
      await user.save();
    }
    res.status(200).send(yon);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
