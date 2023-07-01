const fs = require("fs");
const mongoose = require("mongoose");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ErrorHandler = require("../Controllers/errorController");

const User = require("../Models/userModel");
const Product = require("../Models/products");
const Category = require("../Models/category");
const Cart = require("../Models/cartModel");
const Order = require("../Models/orders");
const Coupon = require("../Models/coupen");
const Banner = require("../Models/banner");

const { generatePDF, generateCSV } = require("../utils/generateReport");
const CategoryOffer = require("../Models/categoryOffer");
const ProductOffer = require("../Models/productOffer");

// Users controls

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

//Category controls

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

exports.addCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  const category = await Category.create({
    name,
    description,
    image: req.fileDetails,
  });
  res.json(category);
}, ErrorHandler);

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  // 1 find the category for update
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name || category.name;
    category.description = description || category.description;

    category.image = req.fileDetails;

    // Save the updated category
    await category.save();

    res.json(category);
  }
});

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

// Products controls

exports.getAllProducts = catchAsync(async (req, res) => {
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
  const files = req.fileDetails;

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
  const { name, price, category, stock, description } = req.body;

  const files = req.fileDetails;

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
    product.stock = stock || product.stock;

    product.image = filePaths;

    // Save the updated product
    await product.save();

    res.json(product);
  } else {
    return next(new AppError("product not found", 404));
  }
});

// deletes need
exports.updateImageCrop = catchAsync(async (req, res, next) => {
  try {
    // console.log(req.body)
    const { cropWidth, cropHeight, cropX, cropY, imageUrl } = req.body;

    // const baseDirectory = process.cwd();
    // const filePath = path.join(baseDirectory,'public',imgPath)
    // console.log(filePath)
    // const image = await Jimp.read(filePath);
    // console.log(image)
    // image.crop(x,y,width,height);
    // console.log(image)

    // if(fs.existsSync(filePath)){
    //     fs.unlink(filePath,(error)=>{
    //         if(error){
    //             console.log(error)
    //         }else{
    //             console.log("Image deleted")
    //         }
    //     })
    // }else{
    //     console.log('Image not found')
    // }

    // await image.writeAsync(filePath);

    // res.status(200).json({msg:"Image cropped successfully"})

    res.json({ message: "image cropped successfully" });
  } catch (error) {
    console.error("Error cropping image:", error);
    res.status(500).json({ msg: "Error occurred while cropping the image." });
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

// Cart Management

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

// Orders Management

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

exports.addCoupons = catchAsync(async (req, res, next) => {
  const couponData = req.body;
  const value = Number(couponData.value);
  const minValue = couponData.minimumOrderValue;

  const currentDate = new Date();
  const expiryDate = new Date(couponData.expiryDate);

  if (minValue < value) {
    return next(new AppError("Discount exceeds the minimum Order Value", 400));
  }

  if (currentDate >= expiryDate) {
    return next(new AppError("Coupon code is Expired", 400));
  }

  if (value < 0) {
    return next(new AppError("Ensure discount value entered correctly.", 400));
  }

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

exports.updateCoupon = catchAsync(async (req, res, next) => {
  const couponData = req.body;
  const value = Number(couponData.value);
  const minValue = couponData.minimumOrderValue;

  const currentDate = new Date();
  const expiryDate = new Date(couponData.expiryDate);

  if (minValue < value) {
    return next(new AppError("Discount exceeds the minimum Order Value", 400));
  }

  if (currentDate >= expiryDate) {
    return next(new AppError("Coupon code is Expired", 400));
  }

  if (value < 0) {
    return next(new AppError("Ensure discount value entered correctly.", 400));
  }

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

  const newBanner = await Banner.create({
    ...bannerData,
    image: req.fileDetails,
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

  banner.image = req.fileDetails;

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

// Filtered Chart Data - Sales Report
// ===============================

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
      data: filteredSalesChartData
        .map((item) => {
          if (filter === "yearly") {
            return item.totalSales;
          } else if (filter === "monthly") {
            const currentYear = new Date().getFullYear();
            if (item.year == currentYear) {
              return item.salesByMonth.map((month) => month.totalSales);
            }
          } else {
            const currentYear = new Date().getFullYear();
            if (item.year == currentYear) {
              return item.salesByWeek.map((week) => week.totalSales);
            }
          }
        })
        .flat()
        .filter((value) => value !== undefined),
      labels: filteredSalesChartData
        .map((item) => {
          if (filter === "yearly") {
            return item.year;
          } else if (filter === "monthly") {
            const currentYear = new Date().getFullYear();
            if (item.year == currentYear) {
              return item.salesByMonth.map((month) => month.month);
            }
          } else {
            const currentYear = new Date().getFullYear();
            if (item.year == currentYear) {
              return item.salesByWeek.map((week) => {
                return `${week.startDate} - ${week.endDate}`;
              });
            }
          }
        })
        .flat()
        .filter((value) => value !== undefined),
    },
    products: {
      data: filteredSalesChartData
        .map((item) => {
          if (item.salesByWeek) {
            const currentYear = new Date().getFullYear();
            if (item.year == currentYear) {
              return item.salesByWeek.map(
                (week) => week.topProduct.totalSaledPrice
              );
            }
          } else if (item.salesByMonth) {
            for (const month of item.salesByMonth) {
              if (month?.topProduct?.totalSaledPrice) {
                return month.topProduct.totalSaledPrice;
              }
            }
            return null; // Return null if no valid totalSaledPrice is found
          } else {
            return item.topProduct.totalSaledPrice;
          }
        })
        .flat()
        .filter((value) => value !== undefined),
      labels: filteredSalesChartData
        .map((item) => {
          if (filter == "yearly") {
            if (typeof item.topProduct === "string") {
              return item.topProduct;
            } else {
              let name = item.topProduct.name;

              if (name) return `${item.year} - ${name}`;
            }
          } else if (item.salesByMonth) {
            const currentYear = new Date().getFullYear();
            if (item.year == currentYear) {
              return item.salesByMonth.map((month) => {
                return `${month.month} - ${month.topProduct.name}`;
              });
            }
          } else {
            const currentYear = new Date().getFullYear();
            if (item.year == currentYear) {
              return item.salesByWeek.map((week) => {
                return `${week.startDate} - ${week.endDate} - ${week.topProduct.name}`;
              });
            }
          }
        })
        .flat()
        .filter((value) => value !== undefined),
    },
  };

  res.json({
    status: "success",
    result: salesChartData.length,
    data: salesChartData,
  });
});

// Revenue , Sales, Orders ( Dashboard data )

exports.getMetricsData = catchAsync(async (req, res, next) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month index

  const lastMonthStartDate = new Date(currentYear, currentMonth - 2, 1); // Subtracting 2 from currentMonth to get the last month's index
  const currentMonthCurrentDate = new Date(
    currentYear,
    currentMonth - 1,
    currentDate.getDate()
  ); // Subtracting 1 from currentMonth to get the current month's index and using current date's day as the current date

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

  // data here
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

/*
REPORTS Downloadable start
==========================
*/

// Generate Sales Report Data

exports.getSalesReportData = catchAsync(async (req, res, next) => {
  const { startDate, endDate, downloadType } = req.query;

  if (!startDate || !endDate || !downloadType) {
    return next(new AppError("error", 401));
  }

  // Fetch all orders from the database
  const start = new Date(startDate);
  const end = new Date(endDate);

  const orders = await Order.find({
    status: "delivered",
    createdAt: {
      $gte: start,
      $lte: end,
    },
  })
    .populate("items.product")
    .exec();

  // find user
  async function findUserName(userID) {
    const user = await User.findOne({ _id: userID });
    return user.username;
  }

  async function getProductNames(items) {
    const productPromises = items.map((item) => productName(item.product));
    return Promise.all(productPromises);
  }

  async function productName(product) {
    try {
      const productData = await Product.findById(product._id);
      return productData ? productData.name : "Unknown Product";
    } catch (error) {
      console.error("Error retrieving product:", error);
      return "Unknown Product";
    }
  }

  // Prepare the sales report data
  const salesReportPromises = orders.map(async (order) => {
    const formattedOrderedDate = new Date(order.createdAt).toLocaleString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );

    const userName = await findUserName(order.user);
    const orderID = order.orderID;

    const productNames = await getProductNames(order.items);

    const productRows = order.items.map((item, index) => {
      const unitPrice = item.product.price;
      const totalPrice = unitPrice * item.quantity;

      return {
        orderID: orderID,
        userName: userName,
        orderedDate: formattedOrderedDate,
        productName: productNames[index],
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        paymentMethod: order.paymentMethod,
      };
    });

    return productRows;
  });

  const salesReport = await Promise.all(salesReportPromises);

  Promise.all(salesReport.flat())
    .then((salesReportData) => {
      // Table data
      const tableData = {
        headers: [],
        rows: [],
      };

      const highlights = {
        headline: `Sales Report`,
        date: `${startDate} - ${endDate}`,
        total: "Total Cancellations:",
        // count: `${totalCount}`,
        company: "Anon Stores",
        Address: "Bangalore Hub,54321 ",
      };

      const headers = [
        "Order ID",
        "User",
        "Ordered Date",
        "Product Name",
        "Quantity",
        "Unit Price",
        "Total Price",
        "Payment Method",
      ];

      headers.forEach((item) => {
        tableData.headers.push(item);
      });

      if (downloadType == "pdf") {
        salesReportData.forEach((item) => {
          const rowData = [
            item.orderID,
            item.userName,
            item.orderedDate,
            item.productName,
            item.quantity,
            item.unitPrice,
            item.totalPrice,
            item.paymentMethod,
          ];
          tableData.rows.push(...[rowData]);
        });
        // Generate PDF REPORT
        generatePDF(tableData, res, highlights);
      } else if (downloadType == "csv") {
        salesReportData.forEach((item) => {
          const rowData = Object.values(item);
          tableData.rows.push({ ...rowData });
        });
        generateCSV(tableData, res);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  // res.json({
  //   status: "success",
  //   result: salesReport.length,
  //   data: salesReport.flat(), // Flatten the array of arrays into a single array
  // });
});

// Stock Report

exports.generateStockReport = catchAsync(async (req, res, next) => {
  const { downloadType } = req.query;

  const products = await Product.find();

  const orders = await Order.find();

  const getCategoryName = async (categoryId) => {
    try {
      const category = await Category.findById(categoryId);
      return category ? category.name : "Unknown Category";
    } catch (error) {
      console.error("Error retrieving category:", error);
      return "Unknown Category";
    }
  };

  const stockReport = products.map((product) => {
    const formattedUpdatedDate = new Date(product.updatedAt).toLocaleString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );

    const categoryPromise = getCategoryName(product.category);
    const productIDPromise = Promise.resolve(product._id); // Create a resolved promise for orderID

    return Promise.all([categoryPromise, productIDPromise])
      .then(([categoryName, productID]) => {
        return {
          productID,
          productName: product.name,
          categoryName,
          totalQuantityOrdered: orders.reduce((total, order) => {
            const orderItem = order.items.find(
              (item) => product._id.toString() === item.product.toString()
            );
            return total + (orderItem ? orderItem.quantity : 0);
          }, 0),
          currentStock: product.stock,
          lastUpdated: formattedUpdatedDate,
        };
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const stockReports = await Promise.all(stockReport);

  Promise.all(stockReports)
    .then((stockReportReportData) => {
      // Table data
      const tableData = {
        headers: [],
        rows: [],
      };

      const highlights = {
        headline: `Stocks Report`,
        date: `All products`,
        total: "Total Cancellations:",
        // count: `${totalCount}`,
        company: "Anon Stores",
        Address: "Bangalore Hub,54321 ",
      };

      const headers = [
        "Product ID",
        "Product Name",
        "Category",
        "Total Ordered Quantity",
        "currentStock",
        "Last Updated",
      ];

      headers.forEach((item) => {
        tableData.headers.push(item);
      });

      if (downloadType == "pdf") {
        stockReportReportData.forEach((item) => {
          const rowData = [
            item.productID,
            item.productName,
            item.categoryName,
            item.totalQuantityOrdered,
            item.currentStock,
            item.lastUpdated,
          ];
          tableData.rows.push(...[rowData]);
        });
        // Generate PDF REPORT
        generatePDF(tableData, res, highlights);
      } else if (downloadType == "csv") {
        stockReportReportData.forEach((item) => {
          const rowData = Object.values(item);
          tableData.rows.push({ ...rowData });
        });
        generateCSV(tableData, res);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  // res.status(200).json({ status: "success", data: products });
});

// Cancelation Report

exports.generateCancellationReport = catchAsync(async (req, res, next) => {
  const { startDate, endDate, downloadType } = req.query;

  if (!startDate || !endDate || !downloadType) {
    return next(new AppError("error", 401));
  }

  // Fetch all orders from the database
  const start = new Date(startDate);
  const end = new Date(endDate);

  const orders = await Order.find({
    updatedAt: {
      $gte: start,
      $lte: end,
    },
  });

  // Filter orders that have the status "cancelled"
  const cancelledOrders = orders.filter(
    (order) => order.status === "cancelled"
  );

  // find user
  async function findUserName(userID) {
    const user = await User.findOne({ _id: userID });
    return user.username;
  }

  // Prepare the cancellation report data
  const cancellationReport = cancelledOrders.map((order) => {
    const formattedOrderedDate = new Date(order.createdAt).toLocaleString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );

    const formattedCancellationDate = new Date(order.updatedAt).toLocaleString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );

    const userPromise = findUserName(order.user);
    const orderIDPromise = Promise.resolve(order.orderID); // Create a resolved promise for orderID

    return Promise.all([userPromise, orderIDPromise])
      .then(([userName, orderID]) => {
        return {
          orderID: orderID,
          userName: userName,
          orderedDate: formattedOrderedDate,
          cancellationReason: order.cancellationReason,
          cancellationDate: formattedCancellationDate,
        };
      })
      .catch((error) => {
        console.error(error);
      });
  });

  Promise.all(cancellationReport)
    .then((cancellationReportData) => {
      // Table data
      const tableData = {
        headers: [],
        rows: [],
      };

      const highlights = {
        headline: `Cancellation Report`,
        date: `${startDate} - ${endDate}`,
        total: "Total Cancellations:",
        // count: `${totalCount}`,
        company: "Anon Stores",
        Address: "Bangalore Hub,54321 ",
      };

      const headers = [
        "Order ID",
        "User",
        "Ordered Date",
        "Reason",
        "Cancellation Date",
      ];

      headers.forEach((item) => {
        tableData.headers.push(item);
      });

      if (downloadType == "pdf") {
        cancellationReportData.forEach((item) => {
          const rowData = [
            item.orderID,
            item.userName,
            item.orderedDate,
            item.cancellationReason,
            item.cancellationDate,
          ];
          tableData.rows.push(...[rowData]);
        });
        // Generate PDF REPORT
        generatePDF(tableData, res, highlights);
      } else if (downloadType == "csv") {
        cancellationReportData.forEach((item) => {
          const rowData = Object.values(item);
          tableData.rows.push({ ...rowData });
        });
        generateCSV(tableData, res);
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

// ReturnRefundReport Report < pending... need updations>

exports.generateReturnRefundReport = catchAsync(async (req, res) => {
  // Fetch all orders from the database
  const orders = await Order.find();

  // Filter orders that have the status "returned" and a refund amount
  const returnedRefundOrders = orders.filter(
    (order) => order.status === "returned" && order.refundAmount
  );

  // Prepare the return refund report data
  const returnRefundReport = returnedRefundOrders.map((order) => {
    const formattedReturnDate = new Date(order.returnDate).toLocaleString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );

    const formattedRefundDate = new Date(order.refundDate).toLocaleString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }
    );

    return {
      orderID: order.orderID,
      userID: order.user,
      returnReason: order.returnReason,
      returnDate: formattedReturnDate,
      refundAmount: order.refundAmount,
      refundDate: formattedRefundDate,
    };
  });

  // Send the return refund report as a response
  res.status(200).json({
    status: "success",
    result: returnRefundReport.length,
    data: returnRefundReport,
  });
});

/*
REPORTS Downloadable End
========================
*/

// OFFER MANAGEMENT START

/* Category Start*/

exports.getAllCategoryOffers = catchAsync(async (req, res) => {
  const categoryOffers = await CategoryOffer.find();

  const categoryOff = await Promise.all(
    categoryOffers.map(async (offer) => {
      const category = await Category.findById(offer.category);
      return {
        id: offer._id,
        categoryName: category.name,
        categoryId: category._id,
        offer: offer.description,
      };
    })
  );

  res.status(200).json({ categoryOffers: categoryOff });
});

exports.createNewCategoryOffer = catchAsync(async (req, res) => {
  const { categoryId, discount, description } = req.body;

  const products = await Product.find({ category: { $in: categoryId } });

  // Validate the request body
  if (!categoryId || !description || !discount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (products.length === 0) {
    return res
      .status(404)
      .json({ error: "No products found in the specified category" });
  }

  // Check if a category offer already exists for the category ID
  const existingCategoryOffer = await CategoryOffer.findOne({
    category: categoryId,
  });
  if (existingCategoryOffer) {
    return res.status(409).json({
      error: "Offer already exists",
    });
  }

  // Calculate the minimum product price for the discount
  const minProductPrice = Math.min(...products.map((product) => product.price));

  if (minProductPrice < discount) {
    return res
      .status(400)
      .json({ message: "Discount exceeds the minimum product price" });
  }

  // Create a new category offer
  const newCategoryOffer = await CategoryOffer.create({
    category: categoryId,
    description: `${description} ${discount}% off`,
    discount,
  });

  // Apply the discount to each product
  for (const product of products) {
    if (product.originalPrice) {
      product.categoryOffer = newCategoryOffer._id;
      product.price -= Math.round((product.price * discount) / 100);
      await product.save();
    } else {
      product.categoryOffer = newCategoryOffer._id;
      product.originalPrice = product.price;
      product.price -= Math.round((product.price * discount) / 100);
      await product.save();
    }
  }

  res.status(201).json(products);
});

exports.getOneCategoryOffer = catchAsync(async (req, res) => {
  const offerId = req.params.id;
  const categoryOffer = await CategoryOffer.findOne({ _id: offerId });

  if (!categoryOffer) {
    return res.status(404).json({ message: "Category offer not found" });
  }

  const category = await Category.findById(categoryOffer.category);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const categoryOff = {
    id: categoryOffer._id,
    categoryId: categoryOffer.category,
    categoryName: category.name,
    offer: categoryOffer.description,
    discount: categoryOffer.discount,
  };
  res.status(200).json({ categoryOffer: categoryOff });
});

exports.updateOneCategoryOffer = catchAsync(async (req, res) => {
  const categoryId = req.params.id;

  const { discount, description } = req.body;

  // Find the category offer by category ID
  const categoryOffer = await CategoryOffer.findOne({ category: categoryId });

  if (!categoryOffer) {
    return res.status(404).json({ error: "Category offer not found" });
  }

  const products = await Product.find({ category: categoryId });

  if (products.length === 0) {
    return res
      .status(404)
      .json({ error: "No products found in the specified category" });
  }

  // Calculate the minimum product price for the discount
  const minProductPrice = Math.min(...products.map((product) => product.price));

  if (minProductPrice < discount) {
    return res
      .status(400)
      .json({ message: "Discount exceeds the minimum product price" });
  }

  // Revert the prices of the products to their original prices
  for (const product of products) {
    const productOffer = await ProductOffer.findById(product.productOffer);

    if (!productOffer) {
      // If the product offer is not found, clear the original price
      product.price = product.originalPrice;
      product.originalPrice = undefined;
      product.originalPrice = product.price;
      product.price -= Math.round((product.price * discount) / 100);
      await product.save();
    } else {
      // find product offer price
      const productOfferPrice = Math.round(
        (product.originalPrice * productOffer.discount) / 100
      );
      product.price = product.originalPrice - productOfferPrice;

      let storeOriginalPriceAsTemp = product.originalPrice; // store as temp

      product.originalPrice = product.price;

      product.price -= Math.round((product.price * discount) / 100);
      product.originalPrice = storeOriginalPriceAsTemp; // assign after discount updated
      await product.save();
    }
  }

  // Update the category offer fields
  categoryOffer.discount = discount;
  categoryOffer.description = description;

  // Save the updated category offer
  await categoryOffer.save();

  res
    .status(200)
    .json({ message: "Category offer updated successfully", categoryOffer });
});

exports.deleteOneCategoryOffer = catchAsync(async (req, res) => {
  const categoryId = req.params.id;

  const products = await Product.find({ category: categoryId });

  const categoryOffer = await CategoryOffer.findOne({ category: categoryId });

  if (!categoryOffer) {
    return res.status(404).json({ error: "Category offer not found" });
  }

  // Revert the prices of the products to their original prices
  for (const product of products) {
    const productOffer = await ProductOffer.findById(product.productOffer);
    if (!productOffer) {
      product.price = product.originalPrice;
      product.originalPrice = undefined;
      product.categoryOffer = undefined;
      await product.save();
    } else {
      product.price =
        product.originalPrice -
        Math.round((product.originalPrice * productOffer.discount) / 100);
      product.categoryOffer = undefined;
      await product.save();
    }
  }

  await categoryOffer.deleteOne();

  res.status(200).json({ status: "deleted" });
});

/* Category End*/

/* Product Start*/

// product retrieve by category id

exports.getFilterProducts = catchAsync(async (req, res) => {
  const categoryId = req.params.categoryId;
  const products = await Product.find({ category: categoryId });
  res.json({ products: products });
});

exports.getAllProductOffers = catchAsync(async (req, res) => {
  const ProductOffers = await ProductOffer.find();

  const ProductOff = await Promise.all(
    ProductOffers.map(async (offer) => {
      const product = await Product.findById(offer.product);
      const category = await Category.findById(product.category);
      const categoryOff = await CategoryOffer.findById(product.categoryOffer);
      return {
        id: offer._id,
        productId: product._id,
        product: product.name,
        categoryName: category.name,
        offer: offer.description,
        productPrice: product.price,
        categoryOff: categoryOff ? categoryOff.description : "No Offer",
        originalPrice: product.originalPrice,
      };
    })
  );

  res.status(200).json({ ProductOffers: ProductOff });
});

exports.createNewProductOffer = catchAsync(async (req, res) => {
  const { productId, categoryId, discount } = req.body;
  // Validate the request body
  if (!productId || !categoryId || !discount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Retrieve the product by ID and category
  const product = await Product.findOne({
    _id: productId,
    category: categoryId,
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Check if a product offer already exists for the productID
  const existingProductOffer = await ProductOffer.findOne({
    product: productId,
  });

  if (existingProductOffer) {
    return res.status(409).json({
      error: "Product offer already exists for the specified product",
    });
  }

  // Calculate the  product price for the discount

  if (product.price < discount) {
    return res
      .status(400)
      .json({ message: "Discount exceeds the minimum product price" });
  }

  // Create a new product offer
  const newProductOffer = await ProductOffer.create({
    product: productId,
    category: categoryId,
    description: `${discount}%`,
    discount,
  });

  // Apply the discount to product
  if (product.originalPrice) {
    product.productOffer = newProductOffer._id;
    product.price -= Math.round((product.price * discount) / 100);
  } else {
    product.productOffer = newProductOffer._id;
    product.originalPrice = product.price;
    product.price -= Math.round((product.price * discount) / 100);
  }

  await product.save();

  res.status(201).json({
    message: "Product offer created successfully",
    productOffer: newProductOffer,
  });
});

exports.getOneProductOffer = catchAsync(async (req, res) => {
  const offerId = req.params.id;
  const productOffer = await ProductOffer.findOne({ _id: offerId });

  if (!productOffer) {
    return res.status(404).json({ message: "Product offer not found" });
  }

  const product = await Product.findById(productOffer.product);
  const category = await Category.findById(productOffer.category);
  if (!product || !category) {
    return res.status(404).json({ message: "Product or Category not found" });
  }

  const productOff = {
    id: productOffer._id,
    productId: productOffer.product,
    productName: product.name,
    CategoryId: product.category,
    CategoryName: category.name,
    offer: productOffer.description,
    discount: productOffer.discount,
  };

  res.status(200).json({ productOffer: productOff });
});

exports.updateOneProductOffer = catchAsync(async (req, res) => {
  const productId = req.params.id;

  const { discount, description } = req.body;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    return res
      .status(404)
      .json({ error: "No product found in the specified product offer" });
  }

  // Find the product offer by product ID
  const productOffer = await ProductOffer.findById(product.productOffer);

  if (!productOffer) {
    return res.status(404).json({ error: "product offer not found" });
  }

  // Calculate the  product price for the discount

  if (product.price < discount || discount < 0) {
    return res
      .status(400)
      .json({ message: "Discount exceeds the minimum product price" });
  }

  const categoryOffer = await CategoryOffer.findById(product.categoryOffer);

  if (!categoryOffer) {
    // If the product offer is not found, clear the original price
    product.price = product.originalPrice;
    product.originalPrice = undefined;
    product.originalPrice = product.price;
    product.price -= Math.round((product.price * discount) / 100);
    await product.save();
  } else {
    // find product offer price
    const categoryOfferPrice = Math.round(
      (product.originalPrice * categoryOffer.discount) / 100
    );
    product.price = product.originalPrice - categoryOfferPrice;

    let storeOriginalPriceAsTemp = product.originalPrice; // store as temp

    product.originalPrice = product.price;

    product.price -= Math.round((product.price * discount) / 100);
    product.originalPrice = storeOriginalPriceAsTemp; // assign after discount updated
    await product.save();
  }

  // Update the category offer fields
  productOffer.discount = discount;
  productOffer.description = `${discount}%`;

  // Save the updated category offer
  await productOffer.save();

  res.status(200).json({ message: "product offer updated successfully" });
});

exports.deleteOneProductOffer = catchAsync(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findOne({ _id: productId });
  const productOffer = await ProductOffer.findById(product.productOffer);

  if (!productOffer) {
    return res.status(404).json({ error: "Product offer not found" });
  }

  // Revert the prices of the products to their original prices
  const categoryOffer = await CategoryOffer.findById(product.categoryOffer);

  if (!categoryOffer) {
    product.price = product.originalPrice;
    product.originalPrice = undefined;
    product.productOffer = undefined;
    await product.save();
  } else {
    product.price =
      product.originalPrice -
      Math.round((product.originalPrice * categoryOffer.discount) / 100);
    product.productOffer = undefined;
    await product.save();
  }

  await productOffer.deleteOne();

  res.status(200).json({ status: "deleted" });
});

/* Product End*/

/* Referral Offer < ... pending >*/

exports.getAllReferralOffers = catchAsync(async (req, res) => {});

exports.createNewReferralOffer = catchAsync(async (req, res) => {});

exports.getOneReferralOffer = catchAsync(async (req, res) => {});

exports.updateOneReferralOffer = catchAsync(async (req, res) => {});

exports.deleteOneReferralOffer = catchAsync(async (req, res) => {});

// OFFER MANAGEMENT END
