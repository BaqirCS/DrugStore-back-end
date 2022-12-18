const Withdraw = require('../models/withdraw.model');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');
const Account = require('../models/acount.model');

// #info => Get all the withdraws
// @des  => GET method + private Access
const getAllWithdraw = async (req, res, next) => {
  try {
    const withdraws = await Withdraw.find().sort({ date: -1 });
    res.status(200).json(withdraws);
  } catch (error) {
    next(error);
  }
};

// #info => Create withdraw
// @des  => POST method + private Access
const createWithdraw = async (req, res, next) => {
  try {
    const accounts = await Account.find();
    let totalMoney = 0;
    let cash = 0;
    accounts.map((item) => {
      totalMoney += item.total;
      if (item.methodOfPay === 'cash') {
        cash += item.total;
      }
      return item;
    });
    const withdraws = await Withdraw.find();
    let allWithdraw = 0;
    withdraws.map((item) => {
      allWithdraw += item.amount;
      return item;
    });
    const availableCash = cash - allWithdraw;
    if (req.body.amount > availableCash) {
      throw new CustomError('there is not enough money to withdraw', 404);
    }
    date = req.body.date;
    const stringFormat =
      date.split('/')[2] + '-' + date.split('/')[1] + '-' + date.split('/')[0];
    req.body.date = stringFormat;
    const withdraw = await Withdraw.create(req.body);
    res.status(200).json(withdraw);
  } catch (error) {
    next(error);
  }
};

// #info => Get single withdraw
// @des  => GET method + private Access
const getSingleWithdraw = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const withdraw = await Withdraw.findById(req.params.id);
    if (!withdraw) {
      throw new CustomError(`No deficiency with ID: ${req.params.id}`, 404);
    }
    res.status(200).json(withdraw);
  } catch (error) {
    next(error);
  }
};

// #info => Update  the Withdraw
// @des  => PATCH method + private Access
const updateWithdraw = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const withdraw = await Withdraw.findById(req.params.id);
    if (!withdraw) {
      throw new CustomError(`No Withdraw with ID: ${req.params.id}`, 404);
    }

    const updatedWithdraw = await Withdraw.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json(updatedWithdraw);
  } catch (error) {
    next(error);
  }
};

// #info => delete Withdraw
// @des  => DELETE method + private Access
const deleteWithdraw = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const withdraw = await Withdraw.findById(req.params.id);
    if (!withdraw) {
      throw new CustomError(`No Withdraw with ID: ${req.params.id}`, 404);
    }
    await withdraw.remove();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllWithdraw,
  getSingleWithdraw,
  createWithdraw,
  updateWithdraw,
  deleteWithdraw,
};
