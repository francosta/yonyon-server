require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const port = process.env.PORT;

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error(
    `MongoURI was not supplied.  Make sure you watch the video on setting up Mongo DB!`
  );
}
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to mongo', err);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
