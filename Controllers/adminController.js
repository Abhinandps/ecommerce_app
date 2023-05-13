const fs = require("fs");
const User = require("../Models/userModel");
const Product = require("../Models/products");
const Category = require("../Models/category");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    result: users.length,
    data: { users },
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
    icon: req.file.path,
  });
  res.json(category);
});

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
      if (category.icon) {
        fs.unlink(category.icon, (err) => {
          if (err) console.log(err);
        });
      }
      category.icon = req.file.path;
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
  if (category.icon) {
    fs.unlink(category.icon, (err) => {
      if (err) console.log(err);
    });
  }

  res.status(204).json({ message: "Category deleted" });
});


exports.getAllProducts = catchAsync(async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      result: products.length,
      data: { products },
    });
  });

exports.addProduct = catchAsync(async (req, res, next) => {
  const { name, price, category, description } = req.body;
  // create a new product object
  const product = new Product({
    name,
    price,
    category,
    description,
    image: req.file.path,
  });

  // Save the product to the database
  await product.save();

  // Send a response to the client
  res.json(product);
});



exports.updateProduct = catchAsync(async (req, res, next) => {
    const { name,price,category,description} = req.body;
    // 1 find the product for update
    const product = await Product.findById(req.params.id);
  
    // 2 if the product exist
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.category = category || product.category;
  
      // Remove the old icon file if a new file is uploaded
      if (req.file) {
        if (product.image) {
          fs.unlink(product.image, (err) => {
            if (err) console.log(err);
          });
        }
        product.image = req.file.path;
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
  
    // Remove the product from the database
    await Product.findByIdAndDelete(req.params.id);
  
    // Delete the icon file from storage
    if (product.image) {
      fs.unlink(product.image, (err) => {
        if (err) console.log(err);
      });
    }
  
    res.status(204).json({ message: "Product deleted" });
  });