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
const Coupon = require("../Models/coupen");
const Banner = require("../Models/banner");
const SalesReport = require("../Models/salesReport");

// Dashboard Start

// exports.getSalesReportData = catchAsync(async (req, res, next) => {
//   const existingSalesReport = await SalesReport.findOne();

//   if (!existingSalesReport) {
//     const initialSalesReport = new SalesReport({
//       year: new Date().getFullYear(),
//       salesData: [],
//     });

//     await initialSalesReport.save();
//   }

//   const orders = await Order.find({status:"delivered"});

//   if (!orders) {
//     return next(new AppError("Order not found", 404));
//   }

//   // Loop through the orders and update the sales report
//   orders.forEach(async (order) => {

//     const year = new Date(order.createdAt).getFullYear();
//     const month = new Date(order.createdAt).toLocaleString("default", {
//       month: "long",
//     });
//     const totalSales = order.totalPrice;
//     const product = order.items[0].product.toString();
//     const revenue = totalSales;

//     const salesReport = await SalesReport.findOne({ year });

//     if (salesReport) {
//       // Update the sales report for the given month
//       const salesData = salesReport.salesData;
//       const existingMonthData = salesData.find((data) => data.month === month);

//       if (existingMonthData) {
//         // existingMonthData.totalSales += totalSales;
//       } else {
//         salesData.push({
//           month,
//           totalSales,
//           topSellingProduct: product,
//           revenue,
//         });
//       }

//       // Save the updated sales report
//       await salesReport.save();
//     } else {
//       // Create a new sales report for the given year
//       const newSalesReport = new SalesReport({
//         year,
//         salesData: [
//           {
//             month,
//             totalSales,
//             topSellingProduct: product,
//             revenue,
//           },
//         ],
//       });

//       // Save the new sales report
//       const createdReport = await newSalesReport.save();
//       console.log("Sales report created:", createdReport);
//     }
//   });

//   // Retrieve the sales report data after updating
//   const salesReports = await SalesReport.find();

//   res.status(200).json({ status: "success", data: salesReports });
// });

// exports.getSalesReportData = catchAsync(async (req, res, next) => {
//   const existingSalesReport = await SalesReport.findOne();

//   if (!existingSalesReport) {
//     const initialSalesReport = new SalesReport({
//       year: new Date().getFullYear(),
//       salesData: [],
//     });

//     await initialSalesReport.save();
//   }

//   const orders = await Order.find({status:"delivered"});

//   if (!orders) {
//     return next(new AppError("Order not found", 404));
//   }

//   // Loop through the orders and update the sales report
//   orders.forEach(async (order) => {

//     const year = new Date(order.createdAt).getFullYear();
//     const month = new Date(order.createdAt).toLocaleString("default", {
//       month: "long",
//     });
//     const totalSales = order.totalPrice;
//     const product = order.items[0].product.toString();
//     const revenue = totalSales;

//     const salesReport = await SalesReport.findOne({ year });

//     if (salesReport) {
//       // Update the sales report for the given month
//       const salesData = salesReport.salesData;
//       const existingMonthData = salesData.find((data) => data.month === month);

//       if (existingMonthData) {
//         // existingMonthData.totalSales += totalSales;
//       } else {
//         salesData.push({
//           month,
//           totalSales,
//           topSellingProduct: product,
//           revenue,
//         });
//       }

//       // Save the updated sales report
//       await salesReport.save();
//     } else {
//       // Create a new sales report for the given year
//       const newSalesReport = new SalesReport({
//         year,
//         salesData: [
//           {
//             month,
//             totalSales,
//             topSellingProduct: product,
//             revenue,
//           },
//         ],
//       });

//       // Save the new sales report
//       const createdReport = await newSalesReport.save();
//       console.log("Sales report created:", createdReport);
//     }
//   });

//   // Retrieve the sales report data after updating
//   const salesReports = await SalesReport.find();

//   res.status(200).json({ status: "success", data: salesReports });
// });

exports.getSalesReportData = catchAsync(async (req, res, next) => {
  const existingSalesReport = await SalesReport.findOne();

  if (!existingSalesReport) {
    const initialSalesReport = new SalesReport({
      year: new Date().getFullYear(),
      salesData: [],
    });

    await initialSalesReport.save();
  }

  const orders = await Order.find({ status: "delivered" });

  if (!orders) {
    return next(new AppError("Order not found", 404));
  }

  // console.log(orders.length);


  // Aggregate sales data from all orders
  const aggregatedData = orders.reduce((data, order,index) => {

    console.log(index)

    const year = new Date(order.createdAt).getFullYear();
    const month = new Date(order.createdAt).toLocaleString("default", {
      month: "long",
    });

    const totalSales = order.totalPrice;


    

    const productsQuantity = {};

    for (const item of order.items) {
      const { product, quantity } = item;
        if (productsQuantity.hasOwnProperty(product)) {
          productsQuantity[product] += quantity;
        } else {
          productsQuantity[product] = quantity;
        }
    }

console.log(productsQuantity)
  

    let highestQuantity = 0;
    let highestQuantityProduct = null;

    for (const [product, quantity] of Object.entries(productsQuantity)) {
      if (quantity > highestQuantity) {
        highestQuantity = quantity;
        highestQuantityProduct = product.toString();
      }
    }

 
    // const product = highestQuantityProduct.toString();
    // console.log(highestQuantity)

    const revenue = totalSales;

    const existingMonthData = data.find(
      (entry) => entry.year === year && entry.month === month
    );

    if (existingMonthData) {
      existingMonthData.totalSales += totalSales;
      existingMonthData.revenue += totalSales;
      if (highestQuantity > existingMonthData.highestQuantity) {
        existingMonthData.topSellingProduct = highestQuantityProduct;
      }
    } else {
      data.push({
        year,
        month,
        totalSales,
        topSellingProduct: highestQuantityProduct,
        revenue,
      });
    }

    return data;
  }, []);



  // Find the existing sales report
  const salesReport = await SalesReport.findOne();

  if (salesReport) {
    // Update the sales report with the aggregated data
    salesReport.salesData = aggregatedData;
    await salesReport.save();
  } else {
    // Create a new sales report with the aggregated data
    const newSalesReport = new SalesReport({
      year: new Date().getFullYear(),
      salesData: aggregatedData,
    });
    await newSalesReport.save();
  }

  // Retrieve the updated sales report data
  const updatedSalesReport = await SalesReport.findOne();

  res.status(200).json({ status: "success", data: updatedSalesReport });
});

exports.getSalesGraphData = catchAsync(async (req, res, next) => {
  const currentYear = new Date().getFullYear();

  const graphData = await SalesReport.aggregate([
    { $match: { year: currentYear } },
    // Unwind the salesData
    { $unwind: "$salesData" },
    // Group by month and product
    {
      $group: {
        _id: {
          month: "$salesData.month",
          product: "$salesData.topSellingProduct",
        },
        totalSales: { $sum: "$salesData.totalSales" },
        count: { $sum: 1 },
      },
    },
    // Group by month and accumulate product statistics
    {
      $group: {
        _id: "$_id.month",
        totalSales: { $sum: "$totalSales" },
        topSellingProduct: {
          $push: {
            product: "$_id.product",
            count: "$count",
          },
        },
      },
    },
    // Project the desired fields and sort by month
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalSales: 1,
        topSellingProduct: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  res.status(200).json({ status: "success", data: graphData });
});

// Dashboard End

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
  const categories = await Category.find({ isDeleted: false });
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

// exports.deleteCategory = catchAsync(async (req, res, next) => {
//   const category = await Category.findById(req.params.id);

//   if (!category) {
//     return next(new AppError("Category not found", 404));
//   }

//   // Remove the category from the database
//   await Category.findByIdAndDelete(req.params.id);

//   // Delete the icon file from storage
//   if (category.image) {
//     fs.unlink(category.image, (err) => {
//       if (err) console.log(err);
//     });
//   }

//   res.status(204).json({ message: "Category deleted" });
// });

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  category.isDeleted = true;
  await category.save();

  if (category.image) {
    fs.unlink(category.image, (err) => {
      if (err) console.log(err);
    });
  }

  res.status(204).json({ message: "Category deleted" });
});

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

// Coupon management

exports.addCoupons = catchAsync(async (req, res) => {
  const couponData = req.body;
  const newCoupon = await Coupon.create(couponData);
  res.status(201).json(newCoupon);
});

exports.getCoupons = catchAsync(async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

exports.getOneCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }
  res.json(coupon);
});

exports.updateCoupon = catchAsync(async (req, res) => {
  console.log(req.body);
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }
  // coupon.updateStatus();
  res.json(coupon);
});

exports.deleteCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }
  res.json({ message: "Coupon deleted" });
});

// Banner management

exports.addBanners = catchAsync(async (req, res) => {
  const bannerData = req.body;
  console.log(bannerData);
  const newBanner = await Banner.create({
    ...bannerData,
    image: req.file.path,
  });
  res.status(201).json(newBanner);
});

exports.getBanners = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: res.paginatedResults,
  });
});

exports.getOneBanner = catchAsync(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) {
    return res.status(404).json({ message: "banner not found" });
  }
  res.status(200).json({
    status: "success",
    data: { banner },
  });
});

exports.updateBanner = catchAsync(async (req, res) => {
  const {
    position,
    title,
    subTitle,
    text,
    button,
    links,
    startDate,
    endDate,
    status,
  } = req.body;
  console.log(req.body);
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return res.status(404).json({ message: "banner not found" });
  }

  banner.position = position || banner.position;
  banner.title = title || banner.title;
  banner.subTitle = subTitle || banner.subTitle;
  banner.text = text || banner.text;
  banner.button = button || banner.button;
  banner.links = links || banner.links;
  banner.startDate = startDate || banner.startDate;
  banner.endDate = endDate || banner.endDate;
  banner.status = status || banner.status;

  // Remove the old icon file if a new file is uploaded
  if (req.file) {
    if (banner.image) {
      fs.unlink(banner.image, (err) => {
        if (err) console.log(err);
      });
    }
    banner.image = req.file.path;
  }

  // Save the updated banner
  await banner.save();

  res.json(banner);
});

exports.deleteBanner = catchAsync(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    return res.status(404).json({ message: "banner not found" });
  }
  res.status(200).json({ message: "banner deleted" });
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
