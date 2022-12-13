const router = require('express').Router();
const { Authenticated, isAdmin } = require('../middlewares/auth');

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
  logout,
  inOrOut,
  getCurrentUser,
} = require('../controllers/user.controller');

router.route('/').get(Authenticated, isAdmin, getAllUsers).post(createUser);
router.route('/currentUser').get(Authenticated, getCurrentUser);
router.route('/login').post(login);
router.route('/inOrOut').get(inOrOut);
router.route('/logout').get(Authenticated, logout);

router
  .route('/:id')
  .get(Authenticated, getUserById)
  .delete(Authenticated, isAdmin, deleteUser)
  .patch(Authenticated, updateUser);

module.exports = router;
