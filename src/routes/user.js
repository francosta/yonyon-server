require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const router = express.Router();

router.get('/', async (req, res) => {
  return res.send('This is the app');
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send({ user });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
