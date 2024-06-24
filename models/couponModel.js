const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  couponname: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  maxDiscountAmount: {
    type: Number,
    default: 500, // Set default max discount amount to 500
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  usageLimits: {
    totalUses: {
      type: Number,
      default: 1,
    },
    perUser: {
      type: Number,
      default: 1,
    },
  },
  conditions: {
    minOrderAmount: {
      type: Number,
      default: 0,
    },
  },
});

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
