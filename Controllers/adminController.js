const fs = require("fs");
const mongoose = require("mongoose");
const User = require("../Models/userModel");
const Product = require("../Models/products");
const Category = require("../Models/category");
const Cart = require("../Models/Cart");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ErrorHandler = require("../Controllers/errorController");
const Order = require("../Models/orders");

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    result: users.length,
    data: { users },
  });
});

exports.getOneUsers = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.getOneCategory = catchAsync(async (req, res) => {
  const categories = await Category.findOne({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    result: categories.length,
    data: { categories },
  });
});

exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    result: categories.length,
    data: { categories },
  });
});

exports.toggleBlock = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 400));
  }
  user.isBlock = !user.isBlock;
  await user.save();
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.addCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  const category = await Category.create({
    name,
    description,
    image: req.file.path,
  });
  res.json(category);
}, ErrorHandler);

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  // 1 find the category for update
  const category = await Category.findById(req.params.id);

  // 2 if the category exist
  if (category) {
    category.name = name || category.name;
    category.description = description || category.description;

    // Remove the old icon file if a new file is uploaded
    if (req.file) {
      if (category.image) {
        fs.unlink(category.image, (err) => {
          if (err) console.log(err);
        });
      }
      category.image = req.file.path;
    }

    // Save the updated category
    await category.save();

    res.json(category);
  } else {
    return next(new AppError("Category not found", 404));
  }
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  // Remove the category from the database
  await Category.findByIdAndDelete(req.params.id);

  // Delete the icon file from storage
  if (category.image) {
    fs.unlink(category.image, (err) => {
      if (err) console.log(err);
    });
  }

  res.status(204).json({ message: "Category deleted" });
});

// exports.getAllProducts = catchAsync(async (req, res) => {
//   const products = await Product.find({ deleted: false });
//   res.status(200).json({
//     status: "success",
//     data: { products },
//   });
// });

exports.getAllProducts = catchAsync(async (req, res) => {
  // const products = await Product.find({ deleted: false });
  res.status(200).json({
    status: "success",
    data: res.paginatedResults,
  });
});

exports.getOneProduct = catchAsync(async (req, res) => {
  const products = await Product.findOne({ _id: req.params.id });
  res.status(200).json({
    status: "success",
    data: { products },
  });
});

exports.addProduct = catchAsync(async (req, res, next) => {
  const { name, price, category, description, stock } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return next(new AppError("No files uploaded", 400));
  }

  const filePaths = files.map((file) => file.path);

  if (filePaths.length < 2) {
    return next(new AppError("No files uploaded", 400));
  }

  // create a new product object
  const product = new Product({
    name,
    price,
    category,
    description,
    stock,
    image: filePaths,
  });

  // Save the product to the database
  await product.save();

  // Send a response to the client
  res.status(201).json({ status: "success", product });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { name, price, category, description } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return next(new AppError("No files uploaded", 400));
  }

  const filePaths = files.map((file) => file.path);

  if (filePaths.length < 2) {
    return next(new AppError("No files uploaded", 400));
  }

  // 1 find the product for update
  const product = await Product.findById(req.params.id);

  // 2 if the product exist
  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;

    // Remove the old image file if a new file is uploaded
    if (files.length > 0) {
      if (Array.isArray(product.image)) {
        // Remove all existing images
        product.image.forEach((filePath) => {
          fs.unlink(filePath, (err) => {
            if (err) console.log(err);
          });
        });
      }
      product.image = filePaths;
    }

    // Save the updated product
    await product.save();

    res.json(product);
  } else {
    return next(new AppError("product not found", 404));
  }
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Set the deleted field to true
  product.deleted = true;
  await product.save();

  res.status(204).json({ message: "Product deleted" });
});

// Carts
exports.getAllCarts = catchAsync(async (req, res, next) => {
  const { userId } = req.query;
  const filters = {};

  if (userId) {
    const userIdObject = new mongoose.Types.ObjectId(userId);
    filters.user = userIdObject;
  }

  const carts = await Cart.find(filters);

  if (carts.length === 0) {
    return res.status(404).json({ message: "No carts found" });
  }

  const cartIds = carts.map((cart) => cart._id);
  const shippingAddresses = await Cart.find({ _id: { $in: cartIds } }).select(
    "shippingAddress"
  );
  const cartsWithShippingAddress = carts.map((cart) => {
    const cartShippingAddress = shippingAddresses.find(
      (address) => address._id.toString() === cart._id.toString()
    );
    return { cart, shippingAddress: cartShippingAddress.shippingAddress };
  });

  res.status(200).json({ cartsWithShippingAddress });
});

// Orders

exports.getAllOrders = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: res.paginatedResults,
  });
});

// exports.getAllOrders = catchAsync(async (req, res, next) => {
//   let results = res.paginatedResults.results;

//   console.log(req.query.orderStatus);

//   // if (req.query.orderStatus) {
//   //   results = results.filter(order => order.orderStatus === req.query.orderStatus);
//   // }

//   // Prepare the paginated results
//   const paginatedResults = {
//     results: results,
//     next: res.paginatedResults.next,
//     previous: res.paginatedResults.previous,
//   };

//   res.status(200).json({
//     status: "success",
//     data: paginatedResults,
//   });

//   res.status(200).json({
//     status: "success",
//     data: results,
//   });
// });

exports.getOrder = catchAsync(async (req, res, next) => {
  const { orderID } = req.params;
  const order = await Order.findOne({ orderID });
  if (!order) {
    return next(new AppError("Order not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: { order },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderID } = req.params;
  const { status } = req.body;

  const order = await Order.findOneAndUpdate(
    { orderID },
    { status },
    { new: true }
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: { order },
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
