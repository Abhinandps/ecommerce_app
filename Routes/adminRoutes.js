const express = require("express");
const router = express.Router();

const adminAuth = require("../Controllers/adminAuth");
const {
  getSalesReportData,
  getAllUsers,
  getOneUsers,
  toggleBlock,
  getOneCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getOneProduct,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  orderCancel,
  getAllCarts,
  addCoupons,
  getOneCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  addBanners,
  getBanners,
  getOneBanner,
  updateBanner,
  deleteBanner,
  getSalesChartData,
  getMetricsData,
  generateStockReport,
  generateCancellationReport,
  getAllCategoryOffers,
  createNewCategoryOffer,
  getOneCategoryOffer,
  updateOneCategoryOffer,
  deleteOneCategoryOffer,
  getAllProductOffers,
  createNewProductOffer,
  getOneProductOffer,
  updateOneProductOffer,
  deleteOneProductOffer,
  getAllReferralOffers,
  createNewReferralOffer,
  getOneReferralOffer,
  updateOneReferralOffer,
  deleteOneReferralOffer,
  getFilterProducts,
  updateImageCrop,
} = require("../Controllers/adminController");

const { isAuthenticate, isAdmin } = require("../middleware/auth");

const Order = require("../Models/orders");

const Product = require("../Models/products");

// pagination
const { paginatedResults } = require("../utils/pagination");

// multer
const {
  uploadSingle,
  uploadMultiple,
  resizeProductPhoto,
} = require("../utils/multerConfig");

const Banner = require("../Models/banner");


router.post("/register", adminAuth.register);
router.post("/login", adminAuth.login);
router.get("/logout", adminAuth.logout);

// Dashboard

router.get("/sales/report", isAdmin, getSalesReportData);

router.get("/sales/graph/report", isAdmin, getSalesChartData);

router.get("/sales/data", isAdmin, getMetricsData);

// Reports

router.get("/stock/report", isAdmin, generateStockReport);

router.get("/cancelled/report", isAdmin, generateCancellationReport);

// Excel|Pdf

// router.get("/download/excel", isAdmin, getExcelReport)

// router.get("/download/pdf", isAdmin, getPdfReport)

// Users

router.get("/users", getAllUsers);

router.get("/users/:id", isAdmin, getOneUsers);

router.put("/:id/block", toggleBlock);

// Categories

router.get("/categories", isAuthenticate, isAdmin, getAllCategories);

router.post("/category", uploadSingle, resizeProductPhoto, addCategory);

router.get("/category/:id", isAuthenticate, isAdmin, getOneCategory);

router.put("/category/:id", uploadSingle, resizeProductPhoto, updateCategory);

router.delete("/category/:id", deleteCategory);

// Products

router.get(
  "/products",
  isAuthenticate,
  isAdmin,
  paginatedResults(Product),
  getAllProducts
);

router.get("/product/:id", isAuthenticate, isAdmin, getOneProduct);

router.post("/product", uploadMultiple, resizeProductPhoto, addProduct);

router.put("/product/:id", uploadMultiple, resizeProductPhoto, updateProduct);

router.delete("/product/:id", deleteProduct);

router.post("/crop-image", isAdmin, updateImageCrop);

// cart

router.get("/carts", isAdmin, getAllCarts);

// Orders

router.get("/orders", isAdmin, paginatedResults(Order), getAllOrders);

// router.get("/orders/filter", isAdmin,paginatedResults(Order),getFilteredOrders );

router
  .route("/orders/:orderID")
  .get(isAdmin, getOrder)
  .put(isAdmin, updateOrderStatus)
  .delete(isAdmin, orderCancel);

// Coupons

router.post("/coupons", isAdmin, addCoupons);

router.get("/coupons", isAdmin, getCoupons);

router
  .route("/coupons/:id")
  .get(isAdmin, getOneCoupon)
  .patch(isAdmin, updateCoupon)
  .delete(isAdmin, deleteCoupon);

router.post("/banners", uploadSingle, resizeProductPhoto, addBanners);

router.get("/banners", isAdmin, paginatedResults(Banner), getBanners);

router
  .route("/banners/:id")
  .get(isAdmin, getOneBanner)
  .put(isAdmin, uploadSingle, resizeProductPhoto, updateBanner)
  .delete(isAdmin, deleteBanner);

// retrieve product based on category id
router.get("/categories/:categoryId/products", isAdmin, getFilterProducts);

// OFFER MANAGEMENT START

/* Category*/

router
  .route("/category-offers")
  .get(isAdmin, getAllCategoryOffers)
  .post(isAdmin, createNewCategoryOffer);

router
  .route("/category-offers/:id")
  .get(isAdmin, getOneCategoryOffer)
  .put(isAdmin, updateOneCategoryOffer)
  .delete(isAdmin, deleteOneCategoryOffer);

/* Product*/

router
  .route("/product-offers")
  .get(isAdmin, getAllProductOffers)
  .post(isAdmin, createNewProductOffer);

router
  .route("/product-offers/:id")
  .get(isAdmin, getOneProductOffer)
  .put(isAdmin, updateOneProductOffer)
  .delete(isAdmin, deleteOneProductOffer);

/* Referral <pending...> */

router
  .route("referral-offers")
  .get(isAdmin, getAllReferralOffers)
  .post(isAdmin, createNewReferralOffer);

router
  .route("referral-offers/:id")
  .get(isAdmin, getOneReferralOffer)
  .put(isAdmin, updateOneReferralOffer)
  .delete(isAdmin, deleteOneReferralOffer);

// OFFER MANAGEMENT END

module.exports = router;
