const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { ERROR_NOT_FOUND } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
// const NotFoundError = require('./utils/errors/NotFoundError');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);
app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: `Ресурс по адресу ${req.path} не найден` });
});
app.use(error);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
