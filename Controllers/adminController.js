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

// try

// exports.getSalesReportData = catchAsync(async (req, res, next) => {
//   const existingSalesReport = await SalesReport.findOne();

//   if (!existingSalesReport) {
//     const initialSalesReport = new SalesReport({
//       year: new Date().getFullYear(),
//       salesData: [],
//     });

//     await initialSalesReport.save();
//   }

//   const orders = await Order.find({ status: "delivered" });

//   if (!orders) {
//     return next(new AppError("Order not found", 404));
//   }

//   // Get all unique years from the orders
//   const uniqueYears = [
//     ...new Set(orders.map((order) => new Date(order.createdAt).getFullYear())),
//   ];

//   // Iterate over each unique year
//   for (const year of uniqueYears) {

//     // Filter orders for the current year
//     const ordersOfYear = orders.filter(
//       (order) => new Date(order.createdAt).getFullYear() === year
//     );

//     console.log(ordersOfYear)
//     console.log("---NEXT---")

//     // Aggregate sales data from all orders
//     const aggregatedData = ordersOfYear.reduce((data, order, index) => {
//       const year = new Date(order.createdAt).getFullYear();
//       const month = new Date(order.createdAt).toLocaleString("default", {
//         month: "long",
//       });

//       // console.log(year, month);

//       const totalSales = order.totalPrice;

//       const productsQuantity = {};

//       for (const item of order.items) {
//         const { product, quantity } = item;
//         if (productsQuantity.hasOwnProperty(product)) {
//           productsQuantity[product] += quantity;
//         } else {
//           productsQuantity[product] = quantity;
//         }
//       }

//       // console.log(productsQuantity)

//       let highestQuantity = 0;
//       let highestQuantityProduct = null;

//       for (const [product, quantity] of Object.entries(productsQuantity)) {
//         if (quantity > highestQuantity) {
//           highestQuantity = quantity;
//           highestQuantityProduct = product.toString();
//         }
//       }

//       // const product = highestQuantityProduct.toString();
//       // console.log(highestQuantity)

//       const revenue = totalSales;

//       const existingMonthData = data.find(
//         (entry) => entry.year === year && entry.month === month
//       );

//       if (existingMonthData) {
//         existingMonthData.totalSales += totalSales;
//         existingMonthData.revenue += totalSales;
//         if (highestQuantity > existingMonthData.highestQuantity) {
//           existingMonthData.topSellingProduct = highestQuantityProduct;
//         }
//       } else {
//         data.push({
//           year,
//           month,
//           totalSales,
//           topSellingProduct: highestQuantityProduct,
//           revenue,
//         });
//       }

//       return data;
//     }, []);

//     // Find the existing sales report
//     const salesReport = await SalesReport.findOne({ year });

//     if (salesReport) {
//       // Update the sales report with the aggregated data
//       salesReport.salesData = aggregatedData;
//       await salesReport.save();
//     } else {
//       // Create a new sales report with the aggregated data
//       const newSalesReport = new SalesReport({
//         year: new Date().getFullYear(),
//         salesData: aggregatedData,
//       });
//       await newSalesReport.save();
//     }
//   }

//   // Retrieve the updated sales report data
//   const updatedSalesReport = await SalesReport.findOne();

//   res.status(200).json({ status: "success", data: updatedSalesReport });
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

//   const orders = await Order.find({ status: "delivered" });

//   if (!orders) {
//     return next(new AppError("Order not found", 404));
//   }

//   // console.log(orders.length);

//   // Aggregate sales data from all orders
//   const aggregatedData = orders.reduce((data, order,index) => {

//     const year = new Date(order.createdAt).getFullYear();
//     const month = new Date(order.createdAt).toLocaleString("default", {
//       month: "long",
//     });

//     console.log(year , month)

//     const totalSales = order.totalPrice;

//     const productsQuantity = {};

//     for (const item of order.items) {
//       const { product, quantity } = item;
//         if (productsQuantity.hasOwnProperty(product)) {
//           productsQuantity[product] += quantity;
//         } else {
//           productsQuantity[product] = quantity;
//         }
//     }

// // console.log(productsQuantity)

//     let highestQuantity = 0;
//     let highestQuantityProduct = null;

//     for (const [product, quantity] of Object.entries(productsQuantity)) {
//       if (quantity > highestQuantity) {
//         highestQuantity = quantity;
//         highestQuantityProduct = product.toString();
//       }
//     }

//     // const product = highestQuantityProduct.toString();
//     // console.log(highestQuantity)

//     const revenue = totalSales;

//     const existingMonthData = data.find(
//       (entry) => entry.year === year && entry.month === month
//     );

//     if (existingMonthData) {
//       existingMonthData.totalSales += totalSales;
//       existingMonthData.revenue += totalSales;
//       if (highestQuantity > existingMonthData.highestQuantity) {
//         existingMonthData.topSellingProduct = highestQuantityProduct;
//       }
//     } else {
//       data.push({
//         year,
//         month,
//         totalSales,
//         topSellingProduct: highestQuantityProduct,
//         revenue,
//       });
//     }

//     return data;
//   }, []);

//   // Find the existing sales report
//   const salesReport = await SalesReport.findOne();

//   if (salesReport) {
//     // Update the sales report with the aggregated data
//     salesReport.salesData = aggregatedData;
//     await salesReport.save();
//   } else {
//     // Create a new sales report with the aggregated data
//     const newSalesReport = new SalesReport({
//       year: new Date().getFullYear(),
//       salesData: aggregatedData,
//     });
//     await newSalesReport.save();
//   }

//   // Retrieve the updated sales report data
//   const updatedSalesReport = await SalesReport.findOne();

//   res.status(200).json({ status: "success", data: updatedSalesReport });
// });

// optional
// almost working one
// exports.getSalesReportData = catchAsync(async (req, res, next) => {
//   const orders = await Order.find({ status: "delivered" });

//   if (!orders || orders.length === 0) {
//     return next(new AppError("No delivered orders found", 404));
//   }

//   // Get all unique years from the orders
//   const uniqueYears = [
//     ...new Set(orders.map((order) => new Date(order.createdAt).getFullYear())),
//   ];

//   // Iterate over each unique year
//   for (const year of uniqueYears) {
//     // console.log(year);
//     // Filter orders for the current year
//     const ordersOfYear = orders.filter(
//       (order) => new Date(order.createdAt).getFullYear() === year
//     );
//     const productsQuantity = {};

//     // Aggregate sales data from all orders
//     const aggregatedData = ordersOfYear.reduce((data, order, index) => {
//       const month = new Date(order.createdAt).toLocaleString("default", {
//         month: "long",
//       });

//       const totalSales = order.totalPrice;

//       for (const item of order.items) {
//         const { product, quantity } = item;

//         if (productsQuantity.hasOwnProperty(product)) {
//           productsQuantity[product] += quantity;
//         } else {
//           productsQuantity[product] = quantity;
//         }
//       }

//       let highestQuantity = 0;
//       let highestQuantityProduct = null;

//       const promises = [];

//       for (const [product, quantity] of Object.entries(productsQuantity)) {
//         const promise = Product.findById({ _id: product })
//           .exec()
//           .then((singleProduct) => {
//             const totalSales = quantity;
//             if (quantity > highestQuantity) {
//               highestQuantity = quantity;
//               highestQuantityProduct = {
//                 _id: singleProduct._id.toString(),
//                 name: singleProduct.name,
//                 totalSales,
//               };
//             } else if (
//               highestQuantityProduct &&
//               highestQuantityProduct._id === singleProduct._id.toString()
//             ) {
//               highestQuantityProduct.totalSales += quantity;
//             }
//           })
//           .catch((error) => {
//             console.error(error);
//           });
//         promises.push(promise);
//       }

//       Promise.all(promises)
//         .then(() => {
//           console.log(highestQuantityProduct, highestQuantity);
//           const revenue = totalSales;

//           const existingMonthData = data.find(
//             (entry) => entry.year === year && entry.month === month
//           );

//           if (existingMonthData) {
//             existingMonthData.totalSales += totalSales;
//             existingMonthData.revenue += totalSales;
//             if (highestQuantity > existingMonthData.highestQuantity) {
//               existingMonthData.topSellingProduct = highestQuantityProduct;
//             }
//           } else {
//             data.push({
//               year,
//               month,
//               totalSales,
//               topSellingProduct: highestQuantityProduct,
//               revenue,
//             });
//           }
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//       return data;
//     }, []);

//     //  Update the totalSales in productsQuantity
//     // for (const [product, quantity] of Object.entries(productsQuantity)) {
//     //   const matchingData = aggregatedData.find(
//     //     (data) => data.topSellingProduct._id === product
//     //   );
//     //   if (matchingData) {
//     //     matchingData.topSellingProduct.totalSales = quantity;
//     //   }
//     // }

//     // Find the existing sales report for the current year
//     const salesReport = await SalesReport.findOne({ year });

//     if (salesReport) {
//       // Update the sales report with the aggregated data
//       salesReport.salesData = aggregatedData;
//       await salesReport.save();
//     } else {
//       // Create a new sales report with the aggregated data for the current year
//       const newSalesReport = new SalesReport({
//         year,
//         salesData: aggregatedData,
//       });
//       await newSalesReport.save();
//     }
//   }

//   // Retrieve all sales reports
//   const updatedSalesReports = await SalesReport.find();

//   res.status(200).json({ status: "success", data: updatedSalesReports });
// });

// exports.getSalesGraphData = catchAsync(async (req, res, next) => {
//   const salesReport = await SalesReport.findOne(); // Assuming you have a single sales report document

//   let graphData = salesReport.salesData.map((data) => ({
//     totalSales: data.totalSales,
//     topSellingProduct: data.topSellingProduct,
//     month: data.month,
//   }));

//   if (req.query.filter === "yearly") {
//     const currentYear = new Date().getFullYear();
//     graphData = graphData.filter((data) => data.month.includes(currentYear));
//   } else if (req.query.filter === "monthly") {
//     const currentMonth = new Date().toLocaleString('default', { month: 'long' });
//     graphData = graphData.filter((data) => data.month === currentMonth);
//   }

//   res.status(200).json({ status: "success", data: graphData });
// });

// exports.getSalesGraphData = catchAsync(async (req, res, next) => {
//   const { filter, year } = req.query;

//   let salesReports;

//   if (filter === "yearly") {
//     // Retrieve all sales reports
//     salesReports = await SalesReport.aggregate([
//       {
//         $unwind: "$salesData",
//       },
//       {
//         $group: {
//           _id: "$year",
//           year: { $first: "$year" },
//           totalSales: { $sum: "$salesData.totalSales" },
//           revenue: { $sum: "$salesData.totalSales" },
//           salesData: { $push: "$salesData" },
//         },
//       },
//     ]);

//     // Get the top-selling product for each year
//     salesReports.forEach((report) => {
//       const topSellingProduct = report.salesData.reduce(
//         (prev, current) =>
//           current.totalSales > prev.totalSales ? current : prev,
//         { totalSales: 0 }
//       ).topSellingProduct;

//       report.topSellingProduct = topSellingProduct;
//     });

//   } else if (filter === "monthly") {
//     // Filter sales reports based on the provided year
//     salesReports = await SalesReport.aggregate([
//       {
//         $match: {
//           year: parseInt(year),
//         },
//       },
//       {
//         $unwind: "$salesData",
//       },
//       {
//         $project: {
//           year: "$year",
//           month: "$salesData.month",
//           totalSales: "$salesData.totalSales",
//           revenue: "$salesData.totalSales",
//           topSellingProduct: "$salesData.topSellingProduct",
//         },
//       },
//     ]);
//   } else {
//     // Invalid filter value
//     return next(new AppError("Invalid filter", 400));
//   }

//   if (!salesReports || salesReports.length === 0) {
//     return next(new AppError("Sales reports not found", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: salesReports.map((report) => ({
//       year: report.year,
//       month: report.month,
//       totalSales: report.totalSales,
//       revenue: report.totalSales,
//       topSellingProduct: report.topSellingProduct,
//     })),
//   });
// });

// exports.getSalesGraphData = catchAsync(async (req, res, next) => {
//   const { filter, year, month } = req.query;

//   console.log(req.query)

//   let salesReports;

//   if (filter === "yearly") {
//     // Retrieve all sales reports
//     salesReports = await SalesReport.aggregate([
//       {
//         $unwind: "$salesData",
//       },
//       {
//         $group: {
//           _id: "$year",
//           year: { $first: "$year" },
//           totalSales: { $sum: "$salesData.totalSales" },
//           revenue: { $sum: "$salesData.totalSales" },
//           salesData: { $push: "$salesData" },
//         },
//       },
//     ]);

//     // Get the top-selling product for the entire year
//     salesReports.forEach((report) => {
//       const topSellingProduct = report.salesData.reduce(
//         (prev, current) =>
//           current.totalSales > prev.totalSales ? current : prev,
//         { totalSales: 0 }
//       ).topSellingProduct;

//       report.topSellingProduct = topSellingProduct;
//     });
//   } else if (filter === "specific-year") {
//     // Filter sales reports based on the provided year
//     salesReports = await SalesReport.aggregate([
//       {
//         $match: {
//           year: parseInt(year),
//         },
//       },
//       {
//         $unwind: "$salesData",
//       },
//       {
//         $project: {
//           year: "$year",
//           month: "$salesData.month",
//           totalSales: "$salesData.totalSales",
//           revenue: "$salesData.totalSales",
//           topSellingProduct: "$salesData.topSellingProduct",
//         },
//       },
//     ]);
//   } else if (filter === "specific-month") {
//     // Filter sales reports based on the provided year and month
//     salesReports = await SalesReport.aggregate([
//       {
//         $match: {
//           year: parseInt(year),
//           "salesData.month": month,
//         },
//       },
//       {
//         $unwind: "$salesData",
//       },
//       {
//         $project: {
//           year: "$year",
//           month: "$salesData.month",
//           totalSales: "$salesData.totalSales",
//           revenue: "$salesData.totalSales",
//           topSellingProduct: "$salesData.topSellingProduct",
//         },
//       },
//     ]);
//   } else {
//     // Invalid filter value
//     return next(new AppError("Invalid filter", 400));
//   }

//   if (!salesReports || salesReports.length === 0) {
//     return next(new AppError("Sales reports not found", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     data: salesReports.map((report) => ({
//       year: report.year,
//       month: report.month,
//       totalSales: report.totalSales,
//       revenue: report.totalSales,
//       topSellingProduct: report.topSellingProduct,
//     })),
//   });
// });

// exports.getSalesGraphData = catchAsync(async (req, res, next) => {
//   const currentYear = new Date().getFullYear();

//   const graphData = await SalesReport.aggregate([
//     { $match: { year: currentYear } },
//     // Unwind the salesData
//     { $unwind: "$salesData" },
//     // Group by month and product
//     {
//       $group: {
//         _id: {
//           month: "$salesData.month",
//           product: "$salesData.topSellingProduct",
//         },
//         totalSales: { $sum: "$salesData.totalSales" },
//         count: { $sum: 1 },
//       },
//     },
//     // Group by month and accumulate product statistics
//     {
//       $group: {
//         _id: "$_id.month",
//         totalSales: { $sum: "$totalSales" },
//         topSellingProduct: {
//           $push: {
//             product: "$_id.product",
//             count: "$count",
//           },
//         },
//       },
//     },
//     // Project the desired fields and sort by month
//     {
//       $project: {
//         _id: 0,
//         month: "$_id",
//         totalSales: 1,
//         topSellingProduct: 1,
//       },
//     },
//     { $sort: { month: 1 } },
//   ]);

//   res.status(200).json({ status: "success", data: graphData });
// });

// exports.getSalesGraphData = catchAsync(async (req, res, next) => {
//   const currentYear = new Date().getFullYear();

//   const graphData = await SalesReport.aggregate([
//     { $match: { year: currentYear } },
//     // Unwind the salesData
//     { $unwind: "$salesData" },
//     // Group by month and product
//     {
//       $group: {
//         _id: {
//           month: "$salesData.month",
//           product: "$salesData.topSellingProduct",
//         },
//         totalSales: { $sum: "$salesData.totalSales" },
//         count: { $sum: 1 },
//       },
//     },
//     // Group by month and accumulate product statistics
//     {
//       $group: {
//         _id: "$_id.month",
//         totalSales: { $sum: "$totalSales" },
//         topSellingProduct: {
//           $push: {
//             product: "$_id.product",
//             count: "$count",
//           },
//         },
//       },
//     },
//     // Project the desired fields and sort by month
//     {
//       $project: {
//         _id: 0,
//         month: "$_id",
//         totalSales: 1,
//         topSellingProduct: 1,
//       },
//     },
//     { $sort: { month: 1 } },
//   ]);

//   res.status(200).json({ status: "success", data: graphData });
// });

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

// Try new Thing for bennter

// exports.getSalesReportData = catchAsync(async (req, res, next) => {
//   // const { year, filter, month, week } = req.query;
//   const currentDate = new Date();
//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth() + 1;
//   const week = Math.ceil((currentDate.getDate() - currentDate.getDay() + 1) / 7);
//   const filter = "yearly"
//   console.log(year, filter,month, week )

//   let salesReport;

//   if (filter === "yearly") {
//     salesReport = await createSalesReport(Number(year), "yearly");
//   } else if (filter === "monthly") {
//     salesReport = await createSalesReport(Number(year),"monthly",Number(month));
//   } else if (filter === "weekly") {
//     salesReport = await createSalesReport(Number(year), "weekly", Number(week));
//   } else {
//     return res.status(400).json({ message: "Invalid filter" });
//   }

//   res.status(200).json({ data: salesReport });
// });

// async function createSalesReport(year, filter, week, month) {
//   let startDate, endDate;

//   if (filter === 'yearly') {
//     startDate = new Date(year, 0, 1); // January 1st of the year
//     endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st of the year
//   } else if (filter === 'monthly') {
//     startDate = new Date(year, month - 1, 1); // First day of the given month
//     endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the given month
//   } else if (filter === 'weekly') {
//     startDate = getStartDateOfWeek(year, week);
//     endDate = getEndDateOfWeek(year, week);
//   }

//   // Query the database for existing sales report document
//   const existingReport = await SalesReport.findOne({
//     year: year,
//     filter: filter,
//     week: week
//   });

//   if (existingReport) {
//     // Update the existing sales report
//     existingReport.startDate = startDate;
//     existingReport.endDate = endDate;
//     existingReport.totalSales = 0; // Reset total sales
//     existingReport.topSellingProducts = []; // Reset top-selling products

//     // Query the database for orders matching the conditions
//     const orders = await Order.find({
//       status: 'delivered',
//       createdAt: { $gte: startDate, $lte: endDate }
//     })
//     .populate('items.product')
//     .exec();

//     // Calculate sales and top-selling product for each order
//     for (const order of orders) {
//       const totalSales = order.items.reduce((acc, item) => {
//         const product = item.product;
//         const quantity = item.quantity;
//         const price = product.price;
//         const sale = quantity * price;
//         return acc + sale;
//       }, 0);

//       existingReport.totalSales += totalSales;

//       for (const item of order.items) {
//         const productId = item.product._id;
//         const productName = item.product.name;
//         const sale = item.quantity * item.product.price;

//         const existingProduct = existingReport.topSellingProducts.find(p => p.productId === productId);
//         if (existingProduct) {
//           existingProduct.sales += sale;
//         } else {
//           existingReport.topSellingProducts.push({
//             productId: productId,
//             name: productName,
//             sales: sale
//           });
//         }
//       }
//     }

//     // Sort the top-selling products by sales in descending order
//     existingReport.topSellingProducts.sort((a, b) => b.sales - a.sales);

//     // Update the existing sales report in the database
//     await existingReport.save();

//     return existingReport;
//   } else {
//     // Create a new sales report document
//     const salesReport = new SalesReport({
//       year: year,
//       filter: filter,
//       week: week,
//       startDate: startDate,
//       endDate: endDate,
//       totalSales: 0,
//       topSellingProducts: []
//     });

//     // Query the database for orders matching the conditions
//     const orders = await Order.find({
//       status: 'delivered',
//       createdAt: { $gte: startDate, $lte: endDate }
//     })
//     .populate('items.product')
//     .exec();

//     // Calculate sales and top-selling product for each order
//     for (const order of orders) {
//       const totalSales = order.items.reduce((acc, item) => {
//         const product = item.product;
//         const quantity = item.quantity;
//         const price = product.price;
//         const sale = quantity * price;
//         return acc + sale;
//       }, 0);

//       salesReport.totalSales += totalSales;

//       for (const item of order.items) {
//         const productId = item.product._id;
//         const productName = item.product.name;
//         const sale = item.quantity * item.product.price;
//         console.log(salesReport)

//         // const existingProduct = salesReport.topSellingProducts.find(p => p.productId === productId);
//       //   if (existingProduct) {
//       //     existingProduct.sales += sale;
//       //   } else {
//       //     salesReport.topSellingProducts.push({
//       //       productId: productId,
//       //       name: productName,
//       //       sales: sale
//       //     });
//       //   }
//       }
//     }

//     // Sort the top-selling products by sales in descending order
//     // salesReport.topSellingProducts.sort((a, b) => b.sales - a.sales);

//     // Save the new sales report to the database
//     await salesReport.save();

//     return salesReport;
//   }
// }

// try another

exports.getSalesReportData = catchAsync(async (req, res, next) => {
  const orders = await Order.find({
    status: "delivered",
  })
    .populate("items.product")
    .exec();

  const salesReport = orders.map((order) => ({
    orderID: order.orderID,
    userID: order.user,
    products: order.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    })),
    totalPrice: order.totalPrice,
    orderDate: order.createdAt,
  }));

  // // Generate sales report data based on the filtered timeframe
  // // const filteredSalesReport = filterData(salesReport, "yearly");

  // const salesByMonth = {};
  // const salesByYear = {};
  // const salesByWeek = {};

  // salesReport.forEach((entry) => {
  //   const year = entry.orderDate.getFullYear();
  //   const month = entry.orderDate.getMonth();
  //   // Sales by week
  //   const week = getWeekNumber(entry.orderDate);

  //   // Get the start and end dates of the week
  //   const startDate = getWeekStartDate(entry.orderDate);
  //   const endDate = getWeekEndDate(entry.orderDate);

  //   const totalSales = entry.totalPrice;

  //   entry.products.forEach((product) => {
  //     const productID = product.product._id;
  //     const quantity = product.quantity;
  //     const saledPrice = entry.totalPrice / product.quantity;

  //     // Sales by month
  //     if (salesByMonth.hasOwnProperty(year)) {
  //       if (salesByMonth[year].hasOwnProperty(month)) {
  //         if (salesByMonth[year][month].hasOwnProperty(productID)) {
  //           salesByMonth[year][month][productID].quantity += quantity;
  //           salesByMonth[year][month][productID].totalSaledPrice +=
  //             saledPrice * quantity;
  //         } else {
  //           salesByMonth[year][month][productID] = {
  //             name: product.product.name,
  //             quantity: quantity,
  //             totalSaledPrice: saledPrice * quantity,
  //           };
  //         }
  //         salesByMonth[year][month].totalSales += totalSales;
  //       } else {
  //         salesByMonth[year][month] = {
  //           [productID]: {
  //             name: product.product.name,
  //             quantity: quantity,
  //             totalSaledPrice: saledPrice * quantity,
  //           },
  //           totalSales: totalSales,
  //         };
  //       }
  //     } else {
  //       salesByMonth[year] = {
  //         [month]: {
  //           [productID]: {
  //             name: product.product.name,
  //             quantity: quantity,
  //             totalSaledPrice: saledPrice * quantity,
  //           },
  //           totalSales: totalSales,
  //         },
  //       };
  //     }

  //     // Sales by year
  //     if (salesByYear.hasOwnProperty(year)) {
  //       if (salesByYear[year].hasOwnProperty(productID)) {
  //         salesByYear[year][productID].quantity += quantity;
  //         salesByYear[year][productID].totalSaledPrice += saledPrice * quantity;
  //       } else {
  //         salesByYear[year][productID] = {
  //           name: product.product.name,
  //           quantity: quantity,
  //           totalSaledPrice: saledPrice * quantity,
  //         };
  //       }
  //       salesByYear[year].totalSales += totalSales;
  //     } else {
  //       salesByYear[year] = {
  //         [productID]: {
  //           name: product.product.name,
  //           quantity: quantity,
  //           totalSaledPrice: saledPrice * quantity,
  //         },
  //         totalSales: totalSales,
  //       };
  //     }

  //     // Sales by week
  //     if (salesByWeek.hasOwnProperty(year)) {
  //       if (salesByWeek[year].hasOwnProperty(week)) {
  //         if (salesByWeek[year][week].hasOwnProperty(productID)) {
  //           salesByWeek[year][week][productID].quantity += quantity;
  //           salesByWeek[year][week][productID].totalSaledPrice +=
  //             saledPrice * quantity;
  //         } else {
  //           salesByWeek[year][week][productID] = {
  //             name: product.product.name,
  //             quantity: quantity,
  //             totalSaledPrice: saledPrice * quantity,
  //           };
  //         }
  //         salesByWeek[year][week].totalSales += totalSales;
  //       } else {
  //         salesByWeek[year][week] = {
  //           [productID]: {
  //             name: product.product.name,
  //             quantity: quantity,
  //             totalSaledPrice: saledPrice * quantity,
  //           },
  //           totalSales: totalSales,
  //           startDate: startDate,
  //           endDate: endDate,
  //         };
  //       }
  //     } else {
  //       salesByWeek[year] = {
  //         [week]: {
  //           [productID]: {
  //             name: product.product.name,
  //             quantity: quantity,
  //             totalSaledPrice: saledPrice * quantity,
  //           },
  //           totalSales: totalSales,
  //           startDate: startDate,
  //           endDate: endDate,
  //         },
  //       };
  //     }
  //   });
  // });

  // function getMonthName(monthNumber) {
  //   const monthNames = [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ];
  //   return monthNames[monthNumber];
  // }

  // function getWeekNumber(date) {
  //   const yearStart = new Date(date.getFullYear(), 0, 1);
  //   const weekNumber = Math.ceil(
  //     ((date - yearStart) / 86400000 + yearStart.getDay() + 1) / 7
  //   );
  //   return weekNumber;
  // }

  // // Function to get the start date of the week
  // function getWeekStartDate(date) {
  //   const weekStart = new Date(date);
  //   weekStart.setDate(date.getDate() - date.getDay() + 1); // Set to the first day (Monday) of the week
  //   return weekStart.toISOString().slice(0, 10); // Format as "YYYY-MM-DD"
  // }

  // // Function to get the end date of the week
  // function getWeekEndDate(date) {
  //   const weekEnd = new Date(date);
  //   weekEnd.setDate(date.getDate() - date.getDay() + 7); // Set to the last day (Sunday) of the week
  //   return weekEnd.toISOString().slice(0, 10); // Format as "YYYY-MM-DD"
  // }

  // // Prepare sales report data for the chart
  // const salesChartDataByMonth = Object.keys(salesByMonth).map((year) => ({
  //   year: year,
  //   salesByMonth: Object.keys(salesByMonth[year]).map((month) => ({
  //     month: getMonthName(parseInt(month)),
  //     topProduct:
  //       salesByMonth[year][month][
  //         Object.keys(salesByMonth[year][month]).reduce((a, b) =>
  //           salesByMonth[year][month][a].totalSaledPrice >
  //           salesByMonth[year][month][b].totalSaledPrice
  //             ? a
  //             : b
  //         )
  //       ],
  //     totalSales: salesByMonth[year][month].totalSales,
  //   })),
  // }));

  // const salesChartDataByYear = Object.keys(salesByYear).map((year) => ({
  //   year: year,
  //   topProduct:
  //     salesByYear[year][
  //       Object.keys(salesByYear[year]).reduce((a, b) =>
  //         salesByYear[year][a].totalSaledPrice >
  //         salesByYear[year][b].totalSaledPrice
  //           ? a
  //           : b
  //       )
  //     ],
  //   totalSales: salesByYear[year].totalSales,
  // }));

  // const salesChartDataByWeek = Object.keys(salesByWeek).map((year) => ({
  //   year: year,
  //   salesByWeek: Object.keys(salesByWeek[year]).map((week) => ({
  //     week: week,
  //     startDate: salesByWeek[year][week].startDate,
  //     endDate: salesByWeek[year][week].endDate,
  //     topProduct:
  //       salesByWeek[year][week][
  //         Object.keys(salesByWeek[year][week]).reduce((a, b) =>
  //           salesByWeek[year][week][a].totalSaledPrice >
  //           salesByWeek[year][week][b].totalSaledPrice
  //             ? a
  //             : b
  //         )
  //       ],
  //     totalSales: salesByWeek[year][week].totalSales,
  //   })),
  // }));

  res.json({
    status: "success",
    result: salesReport.length,
    data: salesReport,
  });
});

// function filterData(salesData, timeframe) {
//   const currentDate = new Date();
//   let filteredData = [];

//   switch (timeframe) {
//     case "yearly":
//       // Get the past 5 years to the current year
//       for (let i = 0; i < 5; i++) {
//         const year = currentDate.getFullYear() - i;
//         filteredData.push(year.toString());
//       }
//       break;

//     case "monthly":
//       // Get the months of the current year
//       const currentYear = currentDate.getFullYear();
//       const currentMonth = currentDate.getMonth();
//       const months = [];
//       for (let i = 0; i <= currentMonth; i++) {
//         months.push(
//           new Date(currentYear, i).toLocaleString("default", { month: "long" })
//         );
//       }
//       filteredData = months;
//       break;

//     case "weekly":
//       // Get the current week (considering each week starts on Monday)
//       const currentWeekStart = new Date(
//         currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
//       );
//       const currentWeekEnd = new Date(
//         currentDate.setDate(currentDate.getDate() + 6)
//       );
//       const daysOfWeek = [
//         "Sunday",
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//       ];
//       filteredData = daysOfWeek.slice(
//         currentWeekStart.getDay(),
//         currentWeekEnd.getDay() + 1
//       );
//       break;

//     default:
//       filteredData = [];
//       break;
//   }

//   return filteredData;
// }

exports.getSalesChartData = catchAsync(async (req, res, next) => {
  const { filter } = req.query;

  const orders = await Order.find({
    status: "delivered",
  })
    .populate("items.product")
    .exec();

  const salesReport = orders.map((order) => ({
    orderID: order.orderID,
    userID: order.user,
    products: order.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    })),
    totalPrice: order.totalPrice,
    orderDate: order.createdAt,
  }));

  // Filter Options
  const salesByMonth = {};
  const salesByYear = {};
  const salesByWeek = {};

  salesReport.forEach((entry) => {
    const year = entry.orderDate.getFullYear();
    const month = entry.orderDate.getMonth();
    const week = getWeekNumber(entry.orderDate);

    // Get the start and end dates of the week
    const startDate = getWeekStartDate(entry.orderDate);
    const endDate = getWeekEndDate(entry.orderDate);

    const totalSales = entry.totalPrice;

    entry.products.forEach((product) => {
      const productID = product.product._id;
      const quantity = product.quantity;
      const saledPrice = entry.totalPrice / product.quantity;

      // Sales by month
      if (salesByMonth.hasOwnProperty(year)) {
        if (salesByMonth[year].hasOwnProperty(month)) {
          if (salesByMonth[year][month].hasOwnProperty(productID)) {
            salesByMonth[year][month][productID].quantity += quantity;
            salesByMonth[year][month][productID].totalSaledPrice +=
              saledPrice * quantity;
          } else {
            salesByMonth[year][month][productID] = {
              name: product.product.name,
              quantity: quantity,
              totalSaledPrice: saledPrice * quantity,
            };
          }
          salesByMonth[year][month].totalSales += totalSales;
        } else {
          salesByMonth[year][month] = {
            [productID]: {
              name: product.product.name,
              quantity: quantity,
              totalSaledPrice: saledPrice * quantity,
            },
            totalSales: totalSales,
          };
        }
      } else {
        salesByMonth[year] = {
          [month]: {
            [productID]: {
              name: product.product.name,
              quantity: quantity,
              totalSaledPrice: saledPrice * quantity,
            },
            totalSales: totalSales,
          },
        };
      }

      // Sales by year
      if (salesByYear.hasOwnProperty(year)) {
        if (salesByYear[year].hasOwnProperty(productID)) {
          salesByYear[year][productID].quantity += quantity;
          salesByYear[year][productID].totalSaledPrice += saledPrice * quantity;
        } else {
          salesByYear[year][productID] = {
            name: product.product.name,
            quantity: quantity,
            totalSaledPrice: saledPrice * quantity,
          };
        }
        salesByYear[year].totalSales += totalSales;
      } else {
        salesByYear[year] = {
          [productID]: {
            name: product.product.name,
            quantity: quantity,
            totalSaledPrice: saledPrice * quantity,
          },
          totalSales: totalSales,
        };
      }

      // Sales by week
      if (salesByWeek.hasOwnProperty(year)) {
        if (salesByWeek[year].hasOwnProperty(week)) {
          if (salesByWeek[year][week].hasOwnProperty(productID)) {
            salesByWeek[year][week][productID].quantity += quantity;
            salesByWeek[year][week][productID].totalSaledPrice +=
              saledPrice * quantity;
          } else {
            salesByWeek[year][week][productID] = {
              name: product.product.name,
              quantity: quantity,
              totalSaledPrice: saledPrice * quantity,
            };
          }
          salesByWeek[year][week].totalSales += totalSales;
        } else {
          salesByWeek[year][week] = {
            [productID]: {
              name: product.product.name,
              quantity: quantity,
              totalSaledPrice: saledPrice * quantity,
            },
            totalSales: totalSales,
            startDate: startDate,
            endDate: endDate,
          };
        }
      } else {
        salesByWeek[year] = {
          [week]: {
            [productID]: {
              name: product.product.name,
              quantity: quantity,
              totalSaledPrice: saledPrice * quantity,
            },
            totalSales: totalSales,
            startDate: startDate,
            endDate: endDate,
          },
        };
      }
    });
  });

  function getMonthName(monthNumber) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[monthNumber];
  }
  // Function to get the week number
  function getWeekNumber(date) {
    const yearStart = new Date(date.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((date - yearStart) / 86400000 + yearStart.getDay() + 1) / 7
    );
    return weekNumber;
  }

  // Function to get the start date of the week
  function getWeekStartDate(date) {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1); // Set to the first day (Monday) of the week
    return weekStart.toISOString().slice(0, 10); // Format as "YYYY-MM-DD"
  }

  // Function to get the end date of the week
  function getWeekEndDate(date) {
    const weekEnd = new Date(date);
    weekEnd.setDate(date.getDate() - date.getDay() + 7); // Set to the last day (Sunday) of the week
    return weekEnd.toISOString().slice(0, 10); // Format as "YYYY-MM-DD"
  }

  // Prepare sales report data for the chart
  const salesChartDataByMonth = Object.keys(salesByMonth).map((year) => ({
    year: year,
    salesByMonth: Object.keys(salesByMonth[year]).map((month) => ({
      month: getMonthName(parseInt(month)),
      topProduct:
        salesByMonth[year][month][
          Object.keys(salesByMonth[year][month]).reduce((a, b) =>
            salesByMonth[year][month][a].totalSaledPrice >
            salesByMonth[year][month][b].totalSaledPrice
              ? a
              : b
          )
        ],
      totalSales: salesByMonth[year][month].totalSales,
    })),
  }));

  const salesChartDataByYear = Object.keys(salesByYear).map((year) => ({
    year: year,
    topProduct:
      salesByYear[year][
        Object.keys(salesByYear[year]).reduce((a, b) =>
          salesByYear[year][a].totalSaledPrice >
          salesByYear[year][b].totalSaledPrice
            ? a
            : b
        )
      ],
    totalSales: salesByYear[year].totalSales,
  }));

  const salesChartDataByWeek = Object.keys(salesByWeek).map((year) => ({
    year: year,
    salesByWeek: Object.keys(salesByWeek[year]).map((week) => ({
      week: week,
      startDate: salesByWeek[year][week].startDate,
      endDate: salesByWeek[year][week].endDate,
      topProduct:
        salesByWeek[year][week][
          Object.keys(salesByWeek[year][week]).reduce((a, b) =>
            salesByWeek[year][week][a].totalSaledPrice >
            salesByWeek[year][week][b].totalSaledPrice
              ? a
              : b
          )
        ],
      totalSales: salesByWeek[year][week].totalSales,
    })),
  }));

  // Filtered Value for sent as response
  let filteredSalesChartData;
  if (filter == "yearly") {
    filteredSalesChartData = salesChartDataByYear;
  } else if (filter == "monthly") {
    filteredSalesChartData = salesChartDataByMonth;
  } else {
    filteredSalesChartData = salesChartDataByWeek;
  }

  const salesChartData = {
    sales: {
      data: filteredSalesChartData.map(item => {
        if(filter === "yearly"){
          return item.totalSales
        }else if (filter === "monthly") {
          const currentYear = new Date().getFullYear();
          if (item.year == currentYear) {
            return item.salesByMonth.map(month=>month.totalSales)
          }
        }else{
          const currentYear = new Date().getFullYear();
          if (item.year == currentYear) {
            return item.salesByWeek.map(week=>week.totalSales)
          }
        }

      }).flat().filter(value => value !== undefined),
      labels: filteredSalesChartData.map(item => {
        if (filter === "yearly") {
          return item.year;
        } else if (filter === "monthly") {
          const currentYear = new Date().getFullYear();
          if (item.year == currentYear) {
            return item.salesByMonth.map(month=>month.month)
          }
        } else{
          const currentYear = new Date().getFullYear();
          if (item.year == currentYear) {
            return item.salesByWeek.map(week=>{ return `${week.startDate} - ${week.endDate}` })
          }
        }
      }).flat().filter(value => value !== undefined)
    },
    products: {
      data:  filteredSalesChartData.map((item) => {
        if (item.salesByWeek) {
          const currentYear = new Date().getFullYear();
          if (item.year == currentYear) {
            return item.salesByWeek.map((week) =>week.topProduct.totalSaledPrice);
          }
          
        }else if (item.salesByMonth) {
          for (const month of item.salesByMonth) {
            if (month?.topProduct?.totalSaledPrice) {
              return month.topProduct.totalSaledPrice;
            }
          }
          return null; // Return null if no valid totalSaledPrice is found
        }
        else{
          return item.topProduct.totalSaledPrice
        }
      }).flat().filter(value => value !== undefined),
      labels: filteredSalesChartData.map(item => {
        if(filter == "yearly"){
          if (typeof item.topProduct === "string") {
            return item.topProduct;
          } else {
            let name=item.topProduct.name

            if(name) return `${item.year} - ${name}`
           
          }
        } else if(item.salesByMonth){
          const currentYear = new Date().getFullYear();
          if (item.year == currentYear) {
            return item.salesByMonth.map(month=> {return `${month.month} - ${month.topProduct.name}`})
          }
        }
        else{
          const currentYear = new Date().getFullYear();
          if (item.year == currentYear) {
            return item.salesByWeek.map(week=> {return `${week.startDate} - ${week.endDate} - ${week.topProduct.name}`})
          }
        }

        
      }).flat().filter(value => value !== undefined)
    }
  };

  console.log(salesChartData)

 

  res.json({
    status: "success",
    result: salesChartData.length,
    data: salesChartData,
  });
});
