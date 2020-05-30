require('dotenv').config();

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: 'You must be logged in.' });
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'You must be logged in.' });
    }
    const { _id } = payload;
    const user = await User.findById(_id);
    req.user = user;
    next();
  });
};

module.exports = auth;
