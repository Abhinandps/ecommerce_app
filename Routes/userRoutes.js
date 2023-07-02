const express = require("express");
const router = express.Router();

const auth = require("../Controllers/auth");
const { isAuthenticate, isAdmin } = require("../middleware/auth");

const {
  getHomeProducts,
  getAllProducts,
  getCart,
  addToCart,
  updateCartItem,
  updateCartTotal,
  removeCartItem,
  getCartItemsCount,
  saveShippingAddress,
  placeOrder,
  orderCancel,
  orderHistory,
  getOrderDetails,
  downloadInvoice,
  getAllCoupons,
  applyCoupon,
  removeCoupon,
  fetchBanners,
  getProfile,
  updateEmail,
  updateMobile,
  updateUsername,
  updateAvatar,
  newArrivals,
  trending,
  toprated,
  bestSellers,
  initialPayment,
  razorpayWebhook,
  getSuggestions,
  addToWishList,
  getWishList,
  removeWishListItem,
  getWishListItemsCount,
  updateShippingAddress,
  getOneShippingAddress,
  deleteShippingAddress,
  categoryItems,
  starRating,
} = require("../Controllers/userController");

const upload = require("../utils/multerConfig");

const { getAllCategories } = require("../Controllers/adminController");
const User = require("../Models/userModel");
const { paginatedResultsUser } = require("../utils/pagination");
const Product = require("../Models/products");

const {uploadSingle,resizeProductPhoto} = require("../utils/multerConfig");


router.get("/otp-login", (req, res) => {
  // if(req.session.userId){
  //     res.redirect('http://127.0.0.1:3000/api/v1/user')
  // }else{
  res.render("user/index");
  // }
});

router.post("/signup", auth.signup);

router.post("/generate-otp", auth.generateOTP);

// Verify the OTP
router.post("/verify-otp", auth.verifyOTP);

router.post("/login/validate", auth.validate);

router.post("/login", auth.login);

router.get("/logout", auth.logout);

// Product

router.get("/getSuggestions", isAuthenticate, getSuggestions);

router.get(
  "/products",
  isAuthenticate,
  paginatedResultsUser(Product),
  getAllProducts
);

// WishList

router
  .route("/wishlist")
  .get(isAuthenticate, getWishList)
  .post(isAuthenticate, addToWishList);

router.delete("/wishlist/:productId", isAuthenticate, removeWishListItem);

router.get("/wishlist/items/count", isAuthenticate, getWishListItemsCount);



// Cart Management

router
  .route("/cart")
  .get(isAuthenticate, getCart)
  .post(isAuthenticate, addToCart);

router
  .route("/cart/:productId")
  .put(isAuthenticate, updateCartItem)
  .delete(isAuthenticate, removeCartItem);

router.patch("/cart/total", isAuthenticate, updateCartTotal);

router.get("/cart/items/count", isAuthenticate, getCartItemsCount);

router.post("/address", isAuthenticate, saveShippingAddress);

router.get("/address/:id", isAuthenticate, getOneShippingAddress);

router.put("/address/:id", isAuthenticate, updateShippingAddress);

router.delete("/address/:id", isAuthenticate, deleteShippingAddress);


router.post("/cart/initialPayment", isAuthenticate, initialPayment);

router.post("/cart/razorpayWebhook", isAuthenticate, razorpayWebhook);

router.post("/cart/placeOrder", isAuthenticate, placeOrder);

// Coupons

router.get("/coupons", isAuthenticate, getAllCoupons);

router.post("/apply-coupon", isAuthenticate, applyCoupon);

router.delete("/coupons/remove", isAuthenticate, removeCoupon);

// Orders

router.get("/orders", isAuthenticate, orderHistory);

router.get("/orders/:orderId/invoice", isAuthenticate, downloadInvoice);

router
  .route("/orders/:orderID")
  .get(isAuthenticate, getOrderDetails)
  .put(isAuthenticate, orderCancel);

module.exports = router;

// Home


router.get("/categoryItems", isAuthenticate, categoryItems); //  <pending...>

router.get("/newArrivals", isAuthenticate, newArrivals);

router.get("/trending", isAuthenticate, trending);

router.get("/topRated", isAuthenticate, toprated);

router.get("/bestsellers", isAuthenticate, bestSellers);

router.get("/home", isAuthenticate, getHomeProducts);

router.post("/ratings", isAuthenticate, starRating)

// Banners

router.get("/banners", isAuthenticate, fetchBanners);

// Manage Profile

router.get("/profile", isAuthenticate, getProfile);

router.put("/profile/username", isAuthenticate, updateUsername);

router.put("/profile/email", isAuthenticate, updateEmail);

router.put("/profile/mobile", isAuthenticate, updateMobile);

router.put(
  "/profile/avatar",
  uploadSingle,
  resizeProductPhoto,
  isAuthenticate,
  updateAvatar
);
