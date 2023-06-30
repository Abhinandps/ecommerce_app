const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  usedBy: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  claimedBy: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  value: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  minimumOrderValue: {
    type: Number,
    required: true,
    default: 0,
  },
  cannotBeCombined: {
    type: Boolean,
    required: true,
    default: false,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

// Post middleware
couponSchema.post("findOneAndUpdate", function (doc) {
  doc.isActive = doc.expiryDate >= new Date();
  doc.save();
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
