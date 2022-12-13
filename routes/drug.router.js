const router = require('express').Router();
const { Authenticated } = require('../middlewares/auth');
const {
  getAllDrugs,
  getSingleDrug,
  deleteDrug,
  updateDrug,
  createDrug,
  getDrugForExp,
} = require('../controllers/drug.controller');

router
  .route('/')
  .get(Authenticated, getAllDrugs)
  .post(Authenticated, createDrug);
router.route('/exp').get(Authenticated, getDrugForExp);
router
  .route('/:id')
  .get(Authenticated, getSingleDrug)
  .patch(Authenticated, updateDrug)
  .delete(Authenticated, deleteDrug);

module.exports = router;
