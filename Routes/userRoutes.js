const express = require("express");
const router = express.Router();

const auth = require("../Controllers/auth");
const { isAuthenticate ,isAdmin} = require("../middleware/auth");

const {
  getHomeProducts,
  getAllProducts,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} = require("../Controllers/userController");

const { getAllCategories } = require("../Controllers/adminController");

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

router.post("/login", auth.login);

router.get("/logout", auth.logout);

// Product

router.get("/products", getAllProducts);


// Cart Management

router.route("/cart").get(isAuthenticate,getCart).post(isAuthenticate,addToCart);

router.route("/cart/:productId").put(isAuthenticate,updateCartItem).delete(isAuthenticate,removeCartItem);

module.exports = router;
