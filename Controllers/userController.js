const Product = require("../Models/products");
const Cart = require("../Models/Cart");
const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");
const ErrorHandler = require("../Controllers/errorController");

const User = require("../Models/userModel");
const Order = require("../Models/orders");

const generateOrderID = () => {
  const date = new Date();
  const timestamp = date.getTime();
  const random = Math.floor(Math.random() * 10000);

  const orderID = `ORD-${timestamp}-${random}`;
  return orderID;
};

exports.getHomeProducts = catchAsync(async (req, res) => {
  const products = await Product.find()
    .limit(10) // Limit to 10 products
    .populate("category", "name"); // Populate category field with name only

  res.json(products);
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find({deleted:false}).populate("category"); // Populate category field with full category document

  res.json({status:"success",data:products});
});

// cart management

exports.getCart = catchAsync(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  const { productSum, totalPrice } = await cart.calculatePrices();

  res.status(200).json({
    status: "success",
    cart,
    productSum,
    totalPrice,
  });
});

exports.addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // Create a new cart if it doesn't exist for the user
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Check if the product already exists in the cart
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  const { productSum, totalPrice } = await cart.calculatePrices();

  res.status(201).json({
    status: "success",
    message: "Item added to cart successfully",
    cart,
    productSum,
    totalPrice,
  });
});

exports.updateCartItem = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  // Update the quantity of the specified product in the cart
  const cartItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  cartItem.quantity = quantity;

  await cart.save();

  const { productSum, totalPrice } = await cart.calculatePrices();

  res.status(201).json({
    status: "success",
    message: "Cart item updated successfully.",
    cart,
    productSum,
    totalPrice,
  });
});

exports.removeCartItem = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });

  // Update the quantity of the specified product in the cart
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();

  const { productSum, totalPrice } = await cart.calculatePrices();

  res.status(204).json({
    status: "success",
    message: "Cart item removed successfully.",
    cart,
    productSum,
    totalPrice,
  });
});


exports.saveShippingAddress = catchAsync( async(req,res)=>{
  
})

// purchase

exports.purchaseItem = catchAsync(async (req, res, next) => {
  const {
    custName,
    mobile,
    address,
    city,
    state,
    country,
    zipCode,
    alterMobile,
    totalPrice,
  } = req.body;

  // Retrieve the user
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  // Retrieve the cart items
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart Not Found", 404));
  }

  // purchase logic

  // validate if the cart is empty
  if (cart.items.length === 0) {
    return next(
      new AppError("Cart is empty. Cannot process the purchase", 400)
    );
  }

  // Validate if the user's address is available for COD
  if (!custName || !address || !city || !zipCode) {
    return next(new AppError("Please provide all the required fields", 400));
  }

  // Validate if the product quantities are available

  const unavailableItems = [];
  for (const item of cart.items) {
    const productId = item.product;
    const quantity = item.quantity;

    const product = await Product.findById({ _id: productId });

    console.log(
      `${product.name} -> ${quantity} no.of stocks = ${product.stock}`
    );

    if (product.stock < quantity) {
      unavailableItems.push(product.name);
      break;
    } else {
      product.stock -= quantity;
      await product.save();
    }
  }

  if (unavailableItems.length > 0) {
    return next(
      new AppError(
        "The following items are no longer available: " +
          unavailableItems.join(", "),
        400
      )
    );
  }

  // Generate a unique order ID
  const orderID = generateOrderID();

  // Create a new order
  const order = new Order({
    orderID: orderID,
    user: user._id,
    items: cart.items,
    shippingAddress: {
      name: custName,
      mobile,
      address,
      city,
      state,
      country,
      zipCode,
      alterMobile,
    },
    paymentMethod: "COD",
    totalPrice,
  });

  await order.save();

  // Clear the cart after the purchase
  cart.items = [];
  await cart.save();
  res.json({ message: "Purchase successful." });
});

// Orders

exports.orderHistory = catchAsync(async (req, res, next) => {

  const orders = await Order.find({user:req.user._id})

  if (!orders) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    success: "success",
    data: orders,
  });
});

exports.getOrderDetails = catchAsync(async (req, res, next) => {
  const { orderID } = req.params;
  const order = await Order.findOne({ orderID, user:req.user._id });
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.status(200).json({
    success: "success",
    data: order,
  });
});

exports.orderCancel = catchAsync(async (req, res, next) => {
  const { orderID } = req.params;
  const order = await Order.findOneAndUpdate(
    { orderID },
    { status: "cancelled" },
    { new: true }
  );
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  if (order.status === "cancelled") {
    return next(new AppError("Order is already cancelled", 400));
  }
  res.json({ message: "Order canceled successfully." });
});


