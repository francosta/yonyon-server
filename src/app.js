require('./models/User');
require('./models/Question');
const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const questionRoutes = require('./routes/question');

const app = express();

app.use(bodyParser.json());
app.use(userRoutes);
app.use(questionRoutes);

module.exports = app;
