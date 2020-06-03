require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const User = mongoose.model('User');
const Yon = mongoose.model('Yon');
const router = express.Router();

// Create user
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: 'Must provide email and password' });
  }

  const user = await User.findOne({ email }).populate({
    path: 'createdYons',
    options: { sort: { created_at: -1 } },
  });
  if (!user) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }

  try {
    await user.authenticate(email, password);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.send({ user, token });
  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or email' });
  }
});

// Get user
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'createdYons',
    options: { sort: { created_at: -1 } },
  });

  res.status(200).send(user);
});

// Get user's unanswered yons
router.get('/me/yons', auth, async (req, res) => {
  let unansweredYons;
  try {
    const user = await User.findById(req.user._id)
      .sort({ created_at: -1 })
      .populate('createdYons');
    const yons = await Yon.find({}).sort({ created_at: -1 });

    const yonsIds = yons.map((yon) => yon._id);
    const answeredYonsIds = user.submittedAnswers.map((answer) => answer.yon);

    const unansweredYonsIds = yonsIds.filter((val) => {
      if (!answeredYonsIds.includes(val)) {
        return val;
      }
    });

    Yon.find({ _id: { $in: unansweredYonsIds } })
      .sort({ created_at: -1 })
      .exec(function (err, data) {
        res.status(200).send(data);
      });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get user's answered yons
router.get('/me/answers', auth, async (req, res) => {
  let unansweredYons;
  try {
    const user = await User.findById(req.user._id);
    const yons = await Yon.find({}).sort({ created_at: -1 });

    const yonsIds = yons.map((yon) => yon._id);
    const answeredYonsIds = user.submittedAnswers.map((answer) => answer.yon);
    const unansweredYonsIds = yonsIds.filter(
      (val) => !answeredYonsIds.includes(val)
    );

    Yon.find({ _id: { $in: answeredYonsIds } })
      .sort({ created_at: -1 })
      .exec(function (err, data) {
        res.status(200).send(data);
      });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
