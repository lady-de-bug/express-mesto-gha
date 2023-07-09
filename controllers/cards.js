const Card = require('../models/card');
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

function getCards(req, res) {
  return Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
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

function deleteCard(req, res) {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: ' Запрашиваемая карточка не найдена' });
        return;
      }

      res.send({ data: card });
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

function likeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: ' Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(201).send({ data: card });
    })
    .catch(() => {
      // if (err.name === 'CastError') {
      //   res.status(ERROR_BAD_REQUEST).send({
      //     message: 'Переданы некорректные данные',
      //   });
      //   return;
      // }
      res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
}

function dislikeCard(req, res) {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({ message: ' Запрашиваемая карточка не найдена' });
        return;
      }
      res.send({ data: card });
    })
    .catch(() => {
      // if (err.name === 'CastError') {
      //   res.status(ERROR_BAD_REQUEST).send({
      //     message: 'Переданы некорректные данные',
      //   });
      //   return;
      // }

      res.status(ERROR_INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
