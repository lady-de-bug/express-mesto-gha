const router = require('express').Router();

const { createCardValidation, findCardByIdValidation } = require('../middlewares/celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCardValidation, createCard);
router.delete('/cards/:cardId', findCardByIdValidation, deleteCard);
router.put('/cards/:cardId/likes', findCardByIdValidation, likeCard);
router.delete('/cards/:cardId/likes', findCardByIdValidation, dislikeCard);

module.exports = router;
