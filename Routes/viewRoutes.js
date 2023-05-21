const express = require("express");
const router = express.Router();

const {
  getAdminLogin,
  getDashboard,
  getUsers,
  getAllCategories,
  getAllProducts,
  getUserLogin,
  getSignIn,
  getUserSignup,
  getHome,
  getOtpForm,
  getShoppingPage,
  getProductDetails
} = require("../Controllers/viewController");

const { isAuthenticate ,isAdmin} = require("../middleware/auth");



// ADMIN VIEW
router.get("/admin/login",isAdmin, getAdminLogin);

router.get("/dashboard",isAdmin, getDashboard);

router.get("/users",isAdmin, getUsers);

router.get("/category",isAdmin, getAllCategories);

router.get("/products",isAdmin, getAllProducts);




// USER VIEW


router.get("/login",isAuthenticate , getUserLogin);

router.get("/signin",isAuthenticate , getSignIn);

router.get("/signup",isAuthenticate , getUserSignup);

router.get("/verify-otp",isAuthenticate , getOtpForm);

router.get("/",isAuthenticate , getHome);

router.get("/shop",isAuthenticate , getShoppingPage);

router.get("/details",isAuthenticate , getProductDetails);

module.exports = router;