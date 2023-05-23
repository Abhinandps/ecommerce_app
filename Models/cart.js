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
      },
    },
  ],
})


// Define a virtual property to calculate the total value
cartSchema.virtual('totalPrice').get(async function () {
  let total = 0;

  for (const item of this.items) {
    const product = await mongoose.model('Product').findById(item.product);
    if (product) {
      total += item.quantity * product.price;
    }
  }
  return total;
})

// Count the total unique products
cartSchema.virtual('totalProducts').get(async function() {
  return this.items.length;
});


// Define a method to calculate the product sum and total price
cartSchema.methods.calculatePrices = async function () {
  const productSum = {};
  let totalPrice = 0;

  for (const item of this.items) {
    const product = await mongoose.model('Product').findById(item.product);
    if (product) {
      const sum = item.quantity * product.price;
      productSum[item.product] = sum;
      totalPrice += sum;
    }
  }

  return { productSum, totalPrice };
};

let Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;


