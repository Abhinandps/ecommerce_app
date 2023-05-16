const express = require("express");
const router = express.Router();

const auth = require("../Controllers/auth");

const {
  getHomeProducts,
  getAllProducts,
} = require("../Controllers/userController");

const {getAllCategories} = require("../Controllers/adminController");



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

router.get("/products", getAllProducts);


module.exports = router;
