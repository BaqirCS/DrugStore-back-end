const mongoose = require('mongoose');
const deficiencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name of drug is required'],
    },
    company: {
      type: String,
      required: [true, 'company of drug is required'],
    },
    neededAmount: {
      type: Number,
      default: 10,
    },
    availableOnStore: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'category of drug is required'],
    },
    urgent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('deficiency', deficiencySchema);
