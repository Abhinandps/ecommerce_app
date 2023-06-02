const express = require("express");
const router = express.Router();


const adminAuth = require("../Controllers/adminAuth");
const {
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
  getAllCarts
} = require("../Controllers/adminController");

const { isAuthenticate, isAdmin } = require("../middleware/auth");

const Order = require("../Models/orders");

const Product = require("../Models/products");

// pagination
const { paginatedResults, paginatedProductResults } = require("../utils/pagination");

// multer
const upload = require("../utils/multerConfig");

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

// router.get("/carts", isAdmin, getAllCarts);




// Orders

router.get("/orders", isAdmin, paginatedResults(Order), getAllOrders);

// router.get("/orders/filter", isAdmin,paginatedResults(Order),getFilteredOrders );


router.route("/orders/:orderID")
  .get(isAdmin, getOrder)
  .put(isAdmin,updateOrderStatus)
  .delete(isAdmin,orderCancel)


module.exports = router;



