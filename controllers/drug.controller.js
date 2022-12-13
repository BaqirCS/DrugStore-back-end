const Drug = require('../models/drug.model');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');

// #info => Get all the drugs
// @des  => GET method + private Access
const getAllDrugs = async (req, res, next) => {
  try {
    const drugs = await Drug.find();
    res.status(200).json(drugs);
  } catch (error) {
    next(error);
  }
};
// #info => Get all the drugs fro exp list
// @des  => GET method + private Access
const getDrugForExp = async (req, res, next) => {
  try {
    const drugs = await Drug.find().sort({ expirationDate: 1 });
    res.status(200).json(drugs);
  } catch (error) {
    next(error);
  }
};

// #info => Create Drug
// @des  => POST method + private Access
const createDrug = async (req, res, next) => {
  try {
    if (req.body.name && req.body.company && req.body.category) {
      const existedDrug = await Drug.findOne({
        name: req.body.name,
        company: req.body.company,
        category: req.body.category,
      });
      if (existedDrug) {
        throw new CustomError(
          'the drug is existed in database, please find and update the drug',
          403
        );
      }
    }
    const drug = await Drug.create(req.body);
    res.status(200).json(drug);
  } catch (error) {
    next(error);
  }
};

// #info => Get single drug
// @des  => GET method + private Access
const getSingleDrug = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const drug = await Drug.findById(req.params.id);
    if (!drug) {
      throw new CustomError(`No drug with ID: ${req.params.id}`, 404);
    }
    res.status(200).json(drug);
  } catch (error) {
    next(error);
  }
};

// #info => Update  the drug
// @des  => PATCH method + private Access
const updateDrug = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const drug = await Drug.findById(req.params.id);
    if (!drug) {
      throw new CustomError(`No drug with ID: ${req.params.id}`, 404);
    }

    if (
      req.body.name !== drug.name &&
      req.body.company != drug.company &&
      req.body.category !== drug.category
    ) {
      const existedDrug = await Drug.findOne({
        name: req.body.name,
        company: req.body.company,
        category: req.body.category,
      });
      if (existedDrug) {
        throw new CustomError(
          'the drug is existed in database, please try a different name, company name , or category',
          403
        );
      }
    }

    const updatedDrug = await Drug.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedDrug);
  } catch (error) {
    next(error);
  }
};

// #info => delete drug
// @des  => DELETE method + private Access
const deleteDrug = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const drug = await Drug.findById(req.params.id);
    if (!drug) {
      throw new CustomError(`No drug with ID: ${req.params.id}`, 404);
    }
    await drug.remove();
    res.status(200).json(drug);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDrugs,
  getSingleDrug,
  deleteDrug,
  updateDrug,
  createDrug,
  getDrugForExp,
};
