const mongoose = require('mongoose');
const CustomError = require('../utils/CustomError');
const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name of drug is required'],
    },
    category: {
      type: String,
      required: [true, 'category of drug is required'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'selling price of drug is required'],
    },
    amount: {
      type: Number,
      required: [true, 'amount of drug is required'],
    },
    total: {
      type: Number,
      required: [true, 'Total of selling is required'],
    },
    methodOfPay: {
      type: String,
      required: [true, 'Method of pay is required'],
      enum: ['cash', 'card'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    drugId: {
      type: mongoose.Types.ObjectId,
      ref: 'drug',
    },
  },
  { timestamps: true }
);
accountSchema.pre('save', async function (next) {
  if (this.isNew) {
    const account = await this.model('drug').findOne({ _id: this.drugId });
    if (account.countInStock < 1) {
      next(
        new CustomError(
          'No Drug to sell, there is No drug to sell, pleaes update count in stock'
        )
      );
    } else {
      account.countInStock = account.countInStock - this.amount;
      await account.save();
      next();
    }
  } else {
    next();
  }
});
module.exports = mongoose.model('account', accountSchema);
