require('./models/User');
require('./models/Yon');
const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('../openApiDocumentation.json');

const userRoutes = require('./routes/user');
const yonRoutes = require('./routes/yon');

const app = express();

app.use(bodyParser.json());
app.use(userRoutes);
app.use(yonRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

module.exports = app;
