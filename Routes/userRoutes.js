const express = require("express");
const router = express.Router();

const auth = require("../Controllers/auth");

const {
  getHomeProducts,
  getAllProducts,
} = require("../Controllers/userController");

router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.get("/", (req, res) => {
  // if(req.session.userId){
  console.log(req.session.userId);
  res.render("user/home");
  // }else{
  //     res.redirect('http://127.0.0.1:3000/api/v1/user/login')
  // }
});

router.get("/login", (req, res) => {
  // if(req.session.userId){
  //     res.redirect('http://127.0.0.1:3000/api/v1/user')
  // }else{
  res.render("user/login");
  // }
});

router.get("/otp-login", (req, res) => {
  // if(req.session.userId){
  //     res.redirect('http://127.0.0.1:3000/api/v1/user')
  // }else{
  res.render("user/index");
  // }
});

router.post("/signup", auth.signup);

router.post("/generate-otp", auth.generateOTP);

// Render the OTP verification form
router.get("/verify-otp", auth.renderVerifyOTP);

// Verify the OTP
router.post("/verify-otp", auth.verifyOTP);

router.post("/login", auth.login);

router.get("/logout", auth.logout);

router.get("/home/products", getHomeProducts);

router.get("/products", getAllProducts);

module.exports = router;
