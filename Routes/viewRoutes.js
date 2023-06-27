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
  getProfile,
  getHome,
  getOtpForm,
  getShoppingPage,
  getProductDetails,
  getCartPage,
  getCheckoutPage,
  getOrdersPage,
  getOneOrder,
  getOrderPage,
  getAllOrders,
  getPaymentPage,
  getAllCoupones,
  getAllBanners,
  getAllCategoryOffer,
  getAllProductOffer,
  getImageCropPage,
  getWishListPage
} = require("../Controllers/viewController");

const { isAuthenticate ,isAdmin} = require("../middleware/auth");
const { getAllProductOffers } = require("../Controllers/adminController");








// ADMIN VIEW
router.get("/admin/login",isAdmin, getAdminLogin);

router.get("/dashboard",isAdmin, getDashboard);

router.get("/users",isAdmin, getUsers);

router.get("/category",isAdmin, getAllCategories);

router.get("/products",isAdmin, getAllProducts);

router.get("/orders", isAdmin, getAllOrders)

router.get("/order",isAdmin , getOrderPage);

router.get("/coupons",isAdmin , getAllCoupones);

router.get("/banners", isAdmin, getAllBanners)

router.get("/category/offer", isAdmin, getAllCategoryOffer)

router.get("/product/offer", isAdmin, getAllProductOffer)

router.get("/product-images", isAdmin, getImageCropPage)



// USER VIEW


router.get("/login",isAuthenticate , getUserLogin);

router.get("/signin",isAuthenticate , getSignIn);

router.get("/signup",isAuthenticate , getUserSignup);

router.get("/verify-otp",isAuthenticate , getOtpForm);

router.get("/",isAuthenticate , getHome);

router.get("/me",isAuthenticate , getProfile);

router.get("/shop",isAuthenticate , getShoppingPage);

router.get("/details",isAuthenticate , getProductDetails);

router.get("/wishlist",isAuthenticate , getWishListPage);

router.get("/cart",isAuthenticate , getCartPage);

router.get("/checkout",isAuthenticate , getCheckoutPage);


router.get("/myorders",isAuthenticate , getOrdersPage);

router.get("/myorder",isAuthenticate , getOneOrder);


router.get("/payment",isAuthenticate , getPaymentPage);


module.exports = router;
