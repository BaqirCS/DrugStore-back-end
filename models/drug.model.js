const mongoose = require('mongoose');
const drugSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name of drug is required'],
    },
    company: {
      type: String,
      required: [true, 'company of drug is required'],
    },
    category: {
      type: String,
      required: [true, 'category of drug is required'],
    },
    basePrice: {
      type: Number,
      required: [true, 'price of drug is required'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'price of drug is required'],
    },
    countInStock: {
      type: Number,
      required: [true, 'count in stock of drug is required'],
    },
    productionDate: {
      type: Date,
      required: [true, 'production Date of drug is required'],
    },
    expirationDate: {
      type: Date,
      required: [true, 'expiration Date of drug is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('drug', drugSchema);
