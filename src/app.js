require('./models/User');
require('./models/Yon');
const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const yonRoutes = require('./routes/yon');

const app = express();

app.use(bodyParser.json());
app.use(userRoutes);
app.use(yonRoutes);

module.exports = app;
