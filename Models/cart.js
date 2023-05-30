// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   items: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         default:1
//       },
//     },
//   ],
//   shippingAddress: [
//     {
//       custName: {
//         type: String,
//         required: [true, "user must have a name"],
//       },
//       mobile: {
//         type: Number,
//         required: [true, "user must have a mobile number"],
//       },
//       address: {
//         type: String,
//         required: [true, "user must have a address"],
//       },
//       city: {
//         type: String,
//         required: true,
//       },
//       state: {
//         type: String,
//         required: true,
//       },
//       locality: {
//         type: String,
//         required: true,
//       },
//       zipCode: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
// });

// // Define a virtual property to calculate the total value
// cartSchema.virtual("totalPrice").get(async function () {
//   let total = 0;

//   for (const item of this.items) {
//     const product = await mongoose.model("Product").findById(item.product);
//     if (product) {
//       total += item.quantity * product.price;
//     }
//   }
//   return total;
// });

// // Count the total unique products
// cartSchema.virtual("totalProducts").get(async function () {
//   return this.items.length;
// });

// // Define a method to calculate the product sum and total price
// cartSchema.methods.calculatePrices = async function () {
//   const productSum = {};
//   let totalPrice = 0;

//   for (const item of this.items) {
//     const product = await mongoose.model("Product").findById(item.product);
//     if (product) {
//       const sum = item.quantity * product.price;
//       productSum[item.product] = sum;
//       totalPrice += sum;
//     }
//   }

//   return { productSum, totalPrice };
// };

// let Cart = mongoose.model("Cart", cartSchema);
// module.exports = Cart;



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
    },
  ],
  totalPrice: {
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

