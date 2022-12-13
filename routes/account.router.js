const router = require('express').Router();
const { Authenticated } = require('../middlewares/auth');

const {
  getAllDaysAccounts,
  getAccountsByMonth,
  getDailyAccounts,
  getTotalAccounts,
  createAccount,
  updateAccount,
} = require('../controllers/account.controller');

router
  .route('/')
  .post(Authenticated, createAccount)
  .get(Authenticated, getAllDaysAccounts);
router.route('/getTotalAccounts').get(Authenticated, getTotalAccounts);
router.route('/getAccountsByMonth').get(Authenticated, getAccountsByMonth);
router.route('/getDailyAccounts').get(Authenticated, getDailyAccounts);

router.route('/:id').patch(Authenticated, updateAccount);

module.exports = router;
