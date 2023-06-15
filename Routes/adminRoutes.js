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
  getSalesChartData

} = require("../Controllers/adminController");

const { isAuthenticate, isAdmin } = require("../middleware/auth");

const Order = require("../Models/orders");

const Product = require("../Models/products");

// pagination
const { paginatedResults } = require("../utils/pagination");

// multer
const upload = require("../utils/multerConfig");
const Banner = require("../Models/banner");

// middleware



router.get("/login", (req, res) => {
  res.render("admin/login");
});


router.get("/", (req, res) => {
  res.render("admin/dashboard");
});


router.post("/register", adminAuth.register);
router.post("/login", adminAuth.login);
router.get("/logout", adminAuth.logout);


// Dashboard

router.get('/sales/report', isAdmin, getSalesReportData)

router.get('/sales/graph/report', isAdmin, getSalesChartData)




// Users

router.get("/users", getAllUsers);

router.get("/users/:id",isAdmin, getOneUsers);

router.put("/:id/block", toggleBlock);

// Categories

router.get("/categories", isAuthenticate, isAdmin, getAllCategories);

router.post("/category", upload.single("image"), addCategory);

router.get("/category/:id",isAuthenticate,isAdmin, getOneCategory);

router.put("/category/:id", upload.single("image"), updateCategory);

router.delete("/category/:id", deleteCategory);

// Products

router.get("/products", isAuthenticate, isAdmin, paginatedResults(Product), getAllProducts);

router.get("/product/:id", isAuthenticate, isAdmin, getOneProduct);

router.post("/product", upload.array('image',2), addProduct);

router.put("/product/:id", upload.array('image',2), updateProduct);

router.delete("/product/:id", deleteProduct);


// cart

router.get("/carts", isAdmin, getAllCarts);




// Orders

router.get("/orders", isAdmin, paginatedResults(Order), getAllOrders);

// router.get("/orders/filter", isAdmin,paginatedResults(Order),getFilteredOrders );


router.route("/orders/:orderID")
  .get(isAdmin, getOrder)
  .put(isAdmin,updateOrderStatus)
  .delete(isAdmin,orderCancel)


// Coupons

router.post("/coupons", isAdmin, addCoupons)

router.get("/coupons", isAdmin, getCoupons)

router.route("/coupons/:id")
  .get(isAdmin, getOneCoupon)
  .patch(isAdmin, updateCoupon)
  .delete(isAdmin, deleteCoupon)


router.post("/banners", upload.single("image"), addBanners)

router.get("/banners", isAdmin,paginatedResults(Banner), getBanners)


router.route("/banners/:id")
.get(isAdmin, getOneBanner)
  .put(isAdmin,  upload.single("image"), updateBanner)
  .delete(isAdmin, deleteBanner)







  

module.exports = router;



