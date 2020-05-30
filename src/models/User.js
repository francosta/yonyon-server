require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const answerSchema = new mongoose.Schema({
  yon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Yon',
  },
  answer: {
    type: Boolean,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  yons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Yon' }],
  answers: [answerSchema],
});

// Authentiate user
userSchema.methods.authenticate = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login.');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login.');
  }

  return user;
};

//Generate JWT for user authentication
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user.id.toString() },
    process.env.JWT_SECRET
  );
  // user.tokens = user.tokens.concat({ token });
  // await user.save();
  return token;
};

//Encrypt password before user is saved
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.email;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
