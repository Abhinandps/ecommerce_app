const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  shippingAddress: [
    {
      custName: {
        type: String,
        required: [true, "User must have a name"],
      },
      mobile: {
        type: Number,
        required: [true, "User must have a mobile number"],
      },
      address: {
        type: String,
        required: [true, "User must have an address"],
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      locality: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      deleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  productSum: {
    type: Object,
    default: {},
  },
});

// Calculate the product sum and total price
cartSchema.methods.calculatePrices = async function () {
  let totalPrice = 0;
  const productSum = {};

  for (const item of this.items) {
    const product = await mongoose.model("Product").findById(item.product);
    if (product) {
      const sum = item.quantity * product.price;
      productSum[item.product] = sum;
      totalPrice += sum;
    }
  }

  return { productSum, totalPrice };
};

// Pre-save hook to update totalPrice and productSum
cartSchema.pre("save", async function (next) {
  const { productSum, totalPrice } = await this.calculatePrices();
  this.productSum = productSum;
  this.totalPrice = totalPrice;
  next();
});

let Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
