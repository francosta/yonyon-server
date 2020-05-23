require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const auth = require('../middleware/auth');
const User = mongoose.model('User');
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

// Get user


module.exports = router;
