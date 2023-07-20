const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

function getUsers(req, res) {
  return User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
}

function getUser(req, res) {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: ' Запрашиваемый пользователь не найден' });
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
}

function createUser(req, res) {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // if (!email || !password) {
  //   res.satus(400).send({ message: 'Не введен email или пароль' });
  //   return;
  // }
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
}

function updateUser(req, res) {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      // if (err.name === 'NotFoundError') {
      //   res
      //     .status(ERROR_NOT_FOUND)
      //     .send({ message: ' Запрашиваемый пользователь не найден' });
      //   return;
      // }
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      // if (err.name === 'NotFoundError') {
      //   res
      //     .status(ERROR_NOT_FOUND)
      //     .send({ message: ' Запрашиваемый пользователь не найден' });
      //   return;
      // }
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
}

function login(req, res) {
  const { email, password } = req.body;
  // if (!email || !password) {
  //   res.satus(400).json({ error: 'Не введен email или пароль' });
  //   return;
  // }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
      // res.cookie('jwt', token);
      // return res.status(200).send({ message: 'Аутентификация прошла успешно' });
    })
    .catch((err) => {
      res.status(401)
        .send({ message: err.message });
    });
}

function getCurrentUser(req, res) {
  return User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: ' Запрашиваемый пользователь не найден' });
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
