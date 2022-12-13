const mongoose = require('mongoose');
const withdrawSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date of withdraw is required'],
    },
    by: {
      type: String,
      required: [true, 'the name of person who withdraw is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason of withdraw is required'],
    },
    amount: {
      type: Number,
      required: [true, 'amount of withdraw is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('withdraw', withdrawSchema);
