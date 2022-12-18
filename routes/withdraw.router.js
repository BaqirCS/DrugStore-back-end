const router = require('express').Router();
const { Authenticated, isAdmin } = require('../middlewares/auth');
const {
  getAllWithdraw,
  getSingleWithdraw,
  createWithdraw,
  updateWithdraw,
  deleteWithdraw,
} = require('../controllers/withdraw.controller');

router
  .route('/')
  .get(Authenticated, getAllWithdraw)
  .post(Authenticated, createWithdraw);
router
  .route('/:id')
  .get(Authenticated, isAdmin, getSingleWithdraw)
  .patch(Authenticated, isAdmin, updateWithdraw)
  .delete(Authenticated, isAdmin, deleteWithdraw);

module.exports = router;
