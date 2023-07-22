const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: { // опишем свойство validate
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Некорректный URL',
    },
    // validate: { // опишем свойство validate
    //   validator(v) {
    //     const regex = /https?:\/\/[w{3}.]?[\S^а-я]/gi;
    //     return regex.test(v);
    //   },
    //   message: 'Некорректный адрес',
    // },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('card', cardSchema);
