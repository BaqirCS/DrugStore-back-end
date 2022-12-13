const Deficiency = require('../models/deficiency.model');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');
// #info => Get all the deficiency
// @des  => GET method + private Access
const getAllDeficiency = async (req, res, next) => {
  try {
    const deficiencies = await Deficiency.find();
    res.status(200).json(deficiencies);
  } catch (error) {
    next(error);
  }
};

// #info => Create deficiency
// @des  => POST method + private Access
const createDeficiency = async (req, res, next) => {
  try {
    if (req.body.name && req.body.company && req.body.category) {
      const existedDeficiency = await Deficiency.findOne({
        name: req.body.name,
        company: req.body.company,
        category: req.body.category,
      });
      if (existedDeficiency) {
        throw new CustomError(
          'the drug is existed in deficiency list, please find and update it',
          403
        );
      }
    }
    const deficiency = await Deficiency.create(req.body);
    res.status(200).json(deficiency);
  } catch (error) {
    next(error);
  }
};

// #info => Get single deficiency
// @des  => GET method + private Access
const getSingleDeficiency = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const deficiency = await Deficiency.findById(req.params.id);
    if (!deficiency) {
      throw new CustomError(`No deficiency with ID: ${req.params.id}`, 404);
    }
    res.status(200).json(deficiency);
  } catch (error) {
    next(error);
  }
};

// #info => Update  the deficiency
// @des  => PATCH method + private Access
const updateDeficiency = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const deficiency = await Deficiency.findById(req.params.id);
    if (!deficiency) {
      throw new CustomError(`No deficiency with ID: ${req.params.id}`, 404);
    }

    if (
      deficiency.name !== req.body.name &&
      deficiency.company !== req.body.company &&
      deficiency.category !== req.body.category
    ) {
      const existedDeficiency = await Deficiency.findOne({
        name: req.body.name,
        company: req.body.company,
        category: req.body.category,
      });

      if (existedDeficiency) {
        throw new CustomError(
          'the drug is existed in database, please try a different name, company name , or category',
          402
        );
      }
    }

    const updatedDeficiency = await Deficiency.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedDeficiency);
  } catch (error) {
    next(error);
  }
};

// #info => delete Deficiency
// @des  => DELETE method + private Access
const deleteDeficiency = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const deficiency = await Deficiency.findById(req.params.id);
    if (!deficiency) {
      throw new CustomError(`No Deficiency with ID: ${req.params.id}`, 404);
    }
    await deficiency.remove();
    res.status(200).json(deficiency);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDeficiency,
  getSingleDeficiency,
  createDeficiency,
  updateDeficiency,
  deleteDeficiency,
};
