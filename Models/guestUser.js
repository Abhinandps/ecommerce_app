const mongoose = require("mongoose");

const guestUserSchema = new mongoose.Schema({
  guestUserID: {
    type: String,
    required: true,
    unique: true,
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
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    default: 0,
  },
  role: { type: String, default: "guest" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate the product sum and total price
guestUserSchema.methods.calculatePrices = async function () {
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
guestUserSchema.pre("save", async function (next) {
  const { productSum, totalPrice } = await this.calculatePrices();
  this.productSum = productSum;
  this.totalPrice = totalPrice;
  next();
});

const GuestUser = mongoose.model("GuestUser", guestUserSchema);

module.exports = GuestUser;
