const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderID: {
      type: String,
      unique: true,
      required: true,
    },
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
    shippingAddress: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Cart',
      require:true
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    razorpayOrderID: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);



let Order = mongoose.model("Order", orderSchema);
module.exports = Order;
