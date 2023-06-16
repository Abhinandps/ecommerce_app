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

// Generate Report Of Data
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

  res.json({
    status: "success",
    result: salesReport.length,
    data: salesReport,
  });
});


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

  filteredSalesChartData.map(data=>{
    console.log(data)
  })


  res.json({
    status: "success",
    result: salesChartData.length,
    data: salesChartData,
  });
});


exports.getMetricsData = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month index

  const lastMonthStartDate = new Date(currentYear, currentMonth - 2, 1); // Subtracting 2 from currentMonth to get the last month's index
  const currentMonthCurrentDate = new Date(currentYear, currentMonth - 1, currentDate.getDate()); // Subtracting 1 from currentMonth to get the current month's index and using current date's day as the current date

  const orders = await Order.find({
    status: "delivered",
    createdAt: {
      $gte: lastMonthStartDate,
      $lt: currentMonthCurrentDate,
    },
  })
    .populate("items.product")
    .exec();

  const orderCount = await Order.countDocuments({
    createdAt: {
      $gte: lastMonthStartDate,
      $lte: currentMonthCurrentDate,
    },
  });

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

  const revenue = salesReport.reduce(
    (totalRevenue, order) => totalRevenue + order.totalPrice,
    0
  );
  const totalOrders = salesReport.length;

  const data = {
    revenue,
    orders: orderCount,
    sales: totalOrders,
  };

  res.json({
    status: "success",
    data,
  });
});



