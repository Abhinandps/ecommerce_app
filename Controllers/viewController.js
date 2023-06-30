// ADMIN
// ==============================

exports.getAdminLogin = (req, res) => {
  if (req.admin) {
    res.redirect("/dashboard");
  } else {
    res.render("admin/login");
  }
};

exports.getDashboard = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/dashboard");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getUsers = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/users");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getAllCategories = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/categories");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getAllProducts = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/products");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getAllCoupones = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/coupons");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getAllOrders = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/orders");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getOrderPage = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/orderDetails.ejs");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getAllBanners = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/banner.ejs");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getAllCategoryOffer = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/categoryOff.ejs");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getAllProductOffer = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/productOff.ejs");
  } else {
    res.redirect("/admin/login");
  }
};

exports.getImageCropPage = (req, res) => {
  if (req.admin) {
    res.render("admin/pages/imageCrop.ejs");
  } else {
    res.redirect("/admin/login");
  }
};

// USER
// =====================================

exports.getUserLogin = (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("user/index.ejs");
  }
};

exports.getSignIn = (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("user/login.ejs");
  }
};

exports.getUserSignup = (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("user/signup.ejs");
  }
};

exports.getOtpForm = (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    const email = req.query.email;
    res.render("user/otp", { email });
  }
};

exports.getHome = (req, res) => {
  if (req.user && req.user.role === "guest") {
    res.render("user/home.ejs");
  } else {
    res.render("user/home.ejs");
  }
};

exports.getProfile = (req, res) => {
  if (req.user) {
    res.render("user/profile.ejs");
  }
};

exports.getShoppingPage = (req, res) => {
  if (req.user && req.user.role === "guest") {
    res.render("user/shop.ejs");
  } else {
    res.render("user/shop.ejs");
  }
};

exports.getProductDetails = (req, res) => {
  if (req.user && req.user.role === "guest") {
    res.render("user/shopDetails");
  } else {
    res.render("user/shopDetails");
  }
};

exports.getCartPage = (req, res) => {
  if (req.user && req.user.role === "guest") {
    res.render("user/cart");
  } else {
    res.render("user/cart");
  }
};

exports.getWishListPage = (req, res) => {
  if (req.user && req.user.role === "user") {
    res.render("user/wishList.ejs");
  } else {
    res.render("user/wishList.ejs", { modal: true });
  }
};

exports.getCheckoutPage = (req, res) => {
  if (req.user && req.user.role === "user") {
    res.render("user/checkout.ejs");
  } else {
    res.render("user/cart", { modal: true });
  }
};

exports.getOrdersPage = (req, res) => {
  if (req.user && req.user.role === "user") {
    res.render("user/order.ejs");
  } else {
    res.redirect("/shop");
  }
};

exports.getOneOrder = (req, res) => {
  if (req.user && req.user.role === "user") {
    res.render("user/orderDetails.ejs");
  } else {
    res.redirect("/shop");
  }
};

exports.getPaymentPage = (req, res) => {
  if (req.user && req.user.role === "user") {
    res.render("user/payment.ejs");
  } else {
    res.redirect("/shop");
  }
};

exports.getErrorPage = (req, res) => {
  res.render("404.ejs");
};
