const router = require('express').Router();

const { updateUserValidation, getUserValidation, updateAvatarValidation } = require('../middlewares/celebrate');

const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.patch('/users/me', updateUserValidation, updateUser);
router.get('/users/:userId', getUserValidation, getUser);
router.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
