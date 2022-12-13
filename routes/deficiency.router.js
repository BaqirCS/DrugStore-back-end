const router = require('express').Router();
const { Authenticated } = require('../middlewares/auth');

const {
  getAllDeficiency,
  getSingleDeficiency,
  createDeficiency,
  updateDeficiency,
  deleteDeficiency,
} = require('../controllers/deficiency.controller');

router
  .route('/')
  .get(Authenticated, getAllDeficiency)
  .post(Authenticated, createDeficiency);
router
  .route('/:id')
  .get(Authenticated, getSingleDeficiency)
  .patch(Authenticated, updateDeficiency)
  .delete(Authenticated, deleteDeficiency);

module.exports = router;
