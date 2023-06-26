const fs = require("fs");
const Product = require("../Models/products");
const Cart = require("../Models/Cart");
const catchAsync = require("../utils/catchAsync");

const Razorpay = require("razorpay");

const AppError = require("../utils/appError");
const ErrorHandler = require("../Controllers/errorController");

const User = require("../Models/userModel");
const Order = require("../Models/orders");
const Coupon = require("../Models/coupen");
const Banner = require("../Models/banner");

const { generateInvoice } = require("../utils/generateInvoice");
const GuestUser = require("../Models/guestUser");
const ProductOffer = require("../Models/productOffer");

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
    .populate("category", "name");

  res.json(products);
});

exports.newArrivals = catchAsync(async (req, res) => {
  const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(5);
  res.json(newArrivals);
});

exports.trending = catchAsync(async (req, res) => {
  const trendingProducts = await Product.find().sort({ views: -1 }).limit(5);
  res.json(trendingProducts);
});

exports.toprated = catchAsync(async (req, res) => {
  const topRatedProducts = await Product.find().sort({ rating: -1 }).limit(5);
  res.json(topRatedProducts);
});

exports.bestSellers = catchAsync(async (req, res) => {
  const orders = await Order.find({ status: "delivered" })
    .populate("items.product")
    .exec();

  const productSales = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const { product, quantity } = item;
      const { _id, name, price, image, description } = product;
      if (productSales[_id]) {
        productSales[_id].quantity += quantity;
      } else {
        productSales[_id] = { _id, name, quantity, price, image, description };
      }
    });
  });

  const sortedProducts = Object.values(productSales).sort(
    (a, b) => b.quantity - a.quantity
  );

  const topSellers = sortedProducts.slice(0, 4);

  res.status(200).json({
    status: "success",
    result: topSellers.length,
    data: {
      bestSellers: topSellers,
    },
  });
});

// exports.getAllProducts = catchAsync(async (req, res) => {
//   const products = await Product.find({ deleted: false }).populate("category");

//  // Retrieve the productOffer values and attach them to the products
//  const productIds = products.map((product) => product._id);
//  const productOffers = await ProductOffer.find({ product: { $in: productIds } });

//  const productsWithOffers = products.map((product) => {
//    const offer = productOffers.find((offer) => offer.product.toString() === product._id.toString());
//    return {
//      ...product._doc,
//      offer: offer ? offer.description : null,
//    };
//  });

//   res.json({ status: "success", data: productsWithOffers });
// });

exports.getAllProducts = catchAsync(async (req, res) => {
  // const filters = req.query;

  // const productsWithOffers = res.paginatedResults.results;
  // const nextPage = res.paginatedResults.next;
  // const previousPage = res.paginatedResults.previous;

  // const currentPage = {
  //   page: req.query.page || 1,
  //   limit: req.query.limit || 10,
  // };\

  // console.log(res.paginatedResults)

  res.status(200).json({
    status: "success",
    result: res.paginatedUserResults.length,
    data: res.paginatedUserResults,
  });
});

// search bar suggestions
exports.getSuggestions = catchAsync(async (req, res) => {
  const searchTerm = req.query.term;

  const products = await Product.find({ name: { $regex: '^' + searchTerm, $options: 'i' } }).limit(5);
  const productsName =  products.map(item=>item.name)

  res.json(productsName);
});

// cart management

exports.getCart = catchAsync(async (req, res) => {
  if (req.user.role === "guest") {
    let cart = await GuestUser.findOne({
      guestUserID: req.user.guestUserID,
    });
    const { productSum, totalPrice } = await cart.calculatePrices();

    return res.status(200).json({
      status: "success",
      cart,
      productSum,
      totalPrice,
    });
  }

  // normal user
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
  console.log(productId, quantity);

  if (req.user.role === "guest") {
    let cart = await GuestUser.findOne({
      guestUserID: req.user.guestUserID,
    });

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

    return res.status(201).json({
      status: "success",
      message: "Item added to cart successfully",
      cart,
      productSum,
      totalPrice,
    });
  }

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

  if (req.user.role === "guest") {
    let guestUser = await GuestUser.findOne({
      guestUserID: req.user.guestUserID,
    });

    const cartItem = guestUser.items.find(
      (item) => item.product.toString() === productId
    );

    cartItem.quantity = quantity;
    await guestUser.save();
    const { productSum } = await cart.calculatePrices();

    return res.status(201).json({
      status: "success",
      message: "Cart item updated successfully.",
      cart,
      productSum,
      totalPrice,
    });
  }

  const cart = await Cart.findOne({ user: req.user._id });

  // Update the quantity of the specified product in the cart
  const cartItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  cartItem.quantity = quantity;

  await cart.save();

  const { productSum } = await cart.calculatePrices();

  res.status(201).json({
    status: "success",
    message: "Cart item updated successfully.",
    cart,
    productSum,
    totalPrice,
  });
});

exports.updateCartTotal = catchAsync(async (req, res) => {
  const { totalPrice } = req.body;

  if (req.user.role === "guest") {
    const cart = await GuestUser.findOneAndUpdate(
      { guestUserID: req.user.guestUserID },
      { totalPrice: totalPrice },
      { new: true }
    );
    return res.status(200).json({
      status: "success",
      message: "Cart total price updated successfully.",
      cart,
    });
  }

  const userId = req.user._id;
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { totalPrice: totalPrice },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Cart total price updated successfully.",
    cart,
  });
});

exports.removeCartItem = catchAsync(async (req, res) => {
  const { productId } = req.params;

  if (req.user.role === "guest") {
    let cart = await GuestUser.findOne({
      guestUserID: req.user.guestUserID,
    });

    // Update the quantity of the specified product in the cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const { productSum, totalPrice } = await cart.calculatePrices();

    return res.status(204).json({
      status: "success",
      message: "Cart item removed successfully.",
      cart,
      productSum,
      totalPrice,
    });
  }

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

exports.getCartItemsCount = catchAsync(async (req, res, next) => {
  if (req.user.role === "guest") {
    let cart = await GuestUser.findOne({
      guestUserID: req.user.guestUserID,
    });
    const cartItemsCount = cart.items.length;

    return res.json({ count: cartItemsCount });
  }
  const cart = await Cart.findOne({ user: req.user._id });

  const cartItemsCount = cart.items.length;

  res.json({ count: cartItemsCount });
});

exports.saveShippingAddress = catchAsync(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.shippingAddress.push(req.body);
  await cart.save();
  res.status(201).json({
    status: "success",
    message: "Shipping address saved successfully.",
    cart,
  });
});

// Coupon

exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const userId = req.user._id;

    // Function to check if a coupon is active or expired
    function isCouponActive(coupon) {
      const currentDate = new Date();
      const expiryDate = coupon.expiryDate;
      const isActive = currentDate <= expiryDate;

      if (coupon.isActive !== isActive) {
        coupon.isActive = isActive;
        coupon.save();
      }

      return isActive;
    }

    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (!isCouponActive(coupon)) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.usedBy.includes(userId) || coupon.claimedBy.includes(userId)) {
      return res.status(400).json({ message: "Coupon has already been used" });
    }

    if (orderTotal < coupon.minimumOrderValue) {
      return res.status(400).json({
        message:
          "Order total does not meet the minimum required amount for this coupon",
      });
    }

    // Store the user ID in the usedBy array
    coupon.usedBy.push(userId);
    await coupon.save();

    // Calculate the discounted amount and final total
    let discountedAmount = 0;
    discountedAmount = coupon.value;

    // Update the discountAmount in the Cart schema

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.discountAmount = discountedAmount;
    await cart.save();

    const finalTotal = orderTotal - discountedAmount;

    res.json({
      message: "Coupon applied successfully",
      discountedAmount,
      finalTotal,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeCoupon = catchAsync(async (req, res) => {
  try {
    const userId = req.user._id;

    const coupon = await Coupon.findOne({ usedBy: userId });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Remove the user ID from the usedBy array
    const index = coupon.usedBy.indexOf(userId);
    if (index > -1) {
      coupon.usedBy.splice(index, 1);
    }

    await coupon.save();

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the discountAmount from the Cart schema
    cart.discountAmount = 0;
    await cart.save();

    res.json({ message: "Coupon removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// initialPayment [ COD ] or razorpay orderID generate

exports.initialPayment = catchAsync(async (req, res, next) => {
  const { shippingAddress, paymentMethod, totalPrice } = req.body;

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
  if (!shippingAddress) {
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

  const orderID = generateOrderID();

  // Handle payment based on the payment method

  if (paymentMethod === "cod") {
    // Handle Cash on Delivery (COD) payment

    // Create a new order
    const order = new Order({
      orderID: orderID,
      user: user._id,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    await order.save();

    // Store the user ID in the usedBy array
    const coupon = await Coupon.findOne({ usedBy: req.user._id });
    if (coupon) {
      coupon.claimedBy.push(req.user._id);
      await coupon.save();
    }

    // Clear the cart after the purchase
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Order Placed Successfully" });
  } else if (paymentMethod === "upi") {
    // Set up Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Create the Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: "INR",
      receipt: orderID,
      payment_capture: 1,
    });

    console.log(razorpayOrder);

    // Retrieve the Razorpay order ID
    const razorpayOrderID = razorpayOrder.id;

    // Return the Razorpay order ID to the frontend
    res.status(200).json({ orderID: razorpayOrderID });
  } else {
    return next(new AppError("Invalid payment method", 400));
  }
});

exports.razorpayWebhook = catchAsync(async (req, res, next) => {
  const paymentStatus = req.body.event;
  if (
    paymentStatus === "payment.failed" ||
    paymentStatus === "payment.cancelled"
  ) {
    return res.status(200).send("Payment failed or cancelled");
  }

  res.status(200).send("Payment successful");
});

// place an order with razorpay

exports.placeOrder = catchAsync(async (req, res, next) => {
  const { orderID, shippingAddress, paymentMethod, totalPrice } = req.body;
  console.log(orderID, shippingAddress, paymentMethod, totalPrice);

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  // Retrieve the cart items
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart Not Found", 404));
  }

  // Create a new order with Razorpay order ID
  const order = new Order({
    orderID: orderID,
    user: user._id,
    items: cart.items,
    shippingAddress,
    paymentMethod,
    totalPrice,
    // razorpayOrderID: razorpayOrderID,
  });

  await order.save();

  // Store the user ID in the usedBy array
  const coupon = await Coupon.findOne({ usedBy: req.user._id });
  if (coupon) {
    coupon.claimedBy.push(req.user._id);
    await coupon.save();
  }

  // Clear the cart after the purchase
  cart.items = [];
  await cart.save();

  // Return the Razorpay order ID to the frontend
  res.status(200).json({ message: "Order Placed Successfully" });
});

// Orders

exports.orderHistory = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

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
  const order = await Order.findOne({ orderID, user: req.user._id });
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

  res.json({ message: "Order canceled successfully." });

  if (order.status === "cancelled") {
    return next(new AppError("Order is cancelled", 400));
  }
});

// invoice

function generateInvoiceNumber() {
  const timestamp = Date.now().toString().substr(-6);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const invoiceNumber = `${timestamp}-${random}`;
  return invoiceNumber;
}

exports.downloadInvoice = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ orderID: req.params.orderId });

  if (!order.invoiceNumber) {
    const invoiceNumber = generateInvoiceNumber();
    order.invoiceNumber = invoiceNumber;
    await order.save();
  }
  generateInvoice(order, req, res);
});

// Banners
exports.fetchBanners = catchAsync(async (req, res, next) => {
  const { position } = req.query;

  const query = {
    status: "active",
  };

  if (position) {
    query.position = position;
  }

  const banners = await Banner.find(query);
  if (!banners || banners.length === 0) {
    return next(new AppError("Banners not found", 404));
  }
  res.status(200).json({
    success: "success",
    data: banners,
  });
});

// Profile

exports.getProfile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userProfile = await User.findById(userId);
  if (!userProfile) {
    return next(new AppError("User profile Not Found", 404));
  }

  const multipleAddress = await Cart.find({ user: userId });
  res
    .status(200)
    .json({ status: "success", data: { userProfile, multipleAddress } });
});

exports.updateUsername = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const newUsername = req.body.username;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { username: newUsername },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError("User Not Found", 404));
  }

  res.status(200).json({ status: "success", data: updatedUser });
});

exports.updateEmail = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const newEmail = req.body.email;

  const existingUser = await User.findOne({ email: newEmail });

  if (existingUser) {
    return next(new AppError("Email already exists", 404));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { email: newEmail },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError("User Not Found", 404));
  }

  res.status(200).json({ status: "success", data: updatedUser });
});

exports.updateMobile = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const newMobile = req.body.mobile;

  const existingUser = await User.findOne({ mobile: newMobile });

  if (existingUser) {
    return next(new AppError("Mobile number already exists", 404));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { mobile: newMobile },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError("User Not Found", 404));
  }

  res.status(200).json({ status: "success", data: updatedUser });
});

exports.updateAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No Avatar file provided", 400));
  }

  const avatarPath = req.file.path;
  const userId = req.user.id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar: avatarPath },
    { new: true }
  );

  if (!updatedUser) {
    return next(new AppError("User Not Found", 404));
  }

  res.status(200).json({ status: "success", data: updatedUser });
});
