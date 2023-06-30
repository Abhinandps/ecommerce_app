const mongoose = require("mongoose");

const productOfferSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  description: {
    type: String,
  },
  discount: {
    type: Number,
    required: true,
  },
});

const ProductOffer = mongoose.model("ProductOffer", productOfferSchema);

module.exports = ProductOffer;
