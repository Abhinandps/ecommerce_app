const mongoose = require("mongoose");

const categoryOfferSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryOffer = mongoose.model("CategoryOffer", categoryOfferSchema);

module.exports = CategoryOffer;
