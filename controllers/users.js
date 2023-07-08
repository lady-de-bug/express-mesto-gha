const User = require('../models/user');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

function getUsers(req, res) {
  return User.find({})
    .then((users) => res.status(200).send({ data: users }))
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

      res.status(200).send({ data: user });
    })
    .catch(() => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
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
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: ' Запрашиваемый пользователь не найден' });
        return;
      }
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
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: ' Запрашиваемый пользователь не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
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
};
