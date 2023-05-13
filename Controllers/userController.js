const Product = require("../Models/products");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getHomeProducts = catchAsync(async (req, res) => {
  const products = await Product.find()
    .limit(10) // Limit to 10 products
    .populate("category", "name"); // Populate category field with name only

  res.json(products);
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find().populate("category"); // Populate category field with full category document

  res.json(products);
});
