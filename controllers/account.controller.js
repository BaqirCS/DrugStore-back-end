const Account = require('../models/acount.model');
const CustomError = require('../utils/CustomError');
const mongoose = require('mongoose');
const Drug = require('../models/drug.model');
const Withdraw = require('../models/withdraw.model');

// #info => Get monthly financials=> Completed
// @des  => GET method + private Access
const getAccountsByMonth = async (req, res, next) => {
  try {
    const accounts = await Account.find();
    const allMonth = accounts.map((item) => {
      return item.date.toString().split(' ')[1];
    });
    const uniqueMonth = [...new Set(allMonth)];
    let overalMoney = 0;
    let cash = 0;
    let card = 0;
    const result = [];
    for (let i = 0; i < uniqueMonth.length; i++) {
      overalMoney = 0;
      cash = 0;
      card = 0;
      accounts.map((item) => {
        if (item.date.toString().split(' ')[1] == uniqueMonth[i]) {
          overalMoney += item.total;
          if (item.methodOfPay == 'cash') {
            cash += item.total;
          }
        }
      });
      card = overalMoney - cash;
      result.push(`${uniqueMonth[i]}>${overalMoney}>${cash}>${card}`);
    }
    const objectResult = result.map((item) => {
      let month = item.split('>')[0];
      let totalSell = item.split('>')[1];
      let cash = item.split('>')[2];
      let card = item.split('>')[3];
      return { month, totalSell, cash, card };
    });
    res.status(200).json(objectResult);
  } catch (error) {
    next(error);
  }
};

// #info => Get all days financials => Completed
// @des  => GET method + private Access
const getAllDaysAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find().sort({ date: -1 });
    const dates = accounts.map((item) => {
      return item.date.toString();
    });
    let result = [];
    const uniqueDates = [...new Set(dates)];
    let totalSell = 0;
    let cash = 0;
    let card = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
      totalSell = 0;
      cash = 0;
      card = 0;
      const x = accounts.map((item) => {
        if (item.date.toString() == uniqueDates[i]) {
          totalSell += item.total;
          if (item.methodOfPay == 'cash') {
            cash += item.total;
          }
        }
        card = totalSell - cash;
        return totalSell;
      });
      result.push(`${uniqueDates[i]}>${totalSell}>${cash}>${card}`);
    }
    const objectResult = result.map((item) => {
      let dayOfWeek = item.split(' ')[0];
      let date =
        item.split(' ')[1] +
        '-' +
        item.split(' ')[2] +
        '-' +
        item.split(' ')[3];

      let totalSell = item.split('>')[1];
      let cash = item.split('>')[2];
      let card = item.split('>')[3];
      return { dayOfWeek, date, totalSell, cash, card };
    });
    res.status(200).json(objectResult);
  } catch (error) {
    next(error);
  }
};

// #info => Get Totoal financials=> completed
// @des  => GET method + private Access=> sum of all sellings+ cash+card+predefined words
const getTotalAccounts = async (req, res, next) => {
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
    const card = totalMoney - cash;
    const withdraws = await Withdraw.find();
    let allWithdraw = 0;
    withdraws.map((item) => {
      allWithdraw += item.amount;
      return item;
    });
    const availableCash = cash - allWithdraw;
    const result = { totalSell: totalMoney, cash, card, availableCash };
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// #info => Get daily financials => completed
// @des  => GET method + private Access=> get date and show all the selling
const getDailyAccounts = async (req, res, next) => {
  try {
    const queryDate = req.query.date;
    if (!queryDate) {
      throw new CustomError(
        'No date specified, please provide a valid date',
        404
      );
    }
    const inputDate = queryDate;
    const date = new Date(inputDate);
    const accounts = await Account.find({ date });
    let totalMoney = 0;
    let cash = 0;
    accounts.map((item) => {
      totalMoney += item.total;
      if (item.methodOfPay === 'cash') {
        cash += item.total;
      }
      return item;
    });
    const card = totalMoney - cash;

    const dayResult = {
      totalSell: totalMoney,
      cash,
      card,
    };
    res.status(200).json({ accounts, dayResult });
  } catch (error) {
    next(error);
  }
};

// #info => Create finanical => completed with out month
// @des  => POST method + private Access
const createAccount = async (req, res, next) => {
  try {
    req.body.sellingPrice = parseInt(req.body.sellingPrice);

    //  how to just get the date from req.body.date
    const inputDate = req.body.date.substr(0, 10);
    //  create a date based on inpute date and it is 100 vital
    req.body.date = new Date(inputDate);
    const account = await Account.create(req.body);
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
};

// #info => Update  the Account => completed
// @des  => PATCH method + private Access
const updateAccount = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new CustomError('ID is not Formatted correctly', 401);
    }
    const account = await Account.findById(req.params.id);
    if (!account) {
      throw new CustomError(`No account with ID: ${req.params.id}`, 404);
    }

    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }
    //calculate amount and set count in stock in Drug model
    if (!req.body.amount) {
      const updateAccount = await Account.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          runValidators: true,
        }
      );

      const x = await Account.findById(req.params.id);
      return res.status(200).json(x);
    }

    const drug = await Drug.findById(account.drugId);
    if (req.body.amount >= account.amount) {
      const x = req.body.amount - account.amount;
      drug.countInStock = drug.countInStock - x;
    } else if (req.body.amount < account.amount) {
      // plus one from count in stock in drug
      const x = account.amount - req.body.amount;
      drug.countInStock = drug.countInStock + x;
    }
    await drug.save();
    const updateAccount = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
      }
    );
    const upfind = await Account.findById(req.params.id);
    res.status(200).json(upfind);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDaysAccounts,
  getAccountsByMonth,
  getDailyAccounts,
  getTotalAccounts,
  createAccount,
  updateAccount,
};
