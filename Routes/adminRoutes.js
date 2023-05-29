const express = require("express");
const router = express.Router();

const multer = require("multer");

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
  orderCancel
} = require("../Controllers/adminController");
const { isAuthenticate, isAdmin } = require("../middleware/auth");

// multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, "public/assets/images/");
    } else if (file.mimetype === "image/svg+xml") {
      cb(null, "public/assets/icons/");
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // set unique filename
  },
});

// multer middleware
const upload = multer({ storage });

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

router.get("/products", isAuthenticate, isAdmin, getAllProducts);

router.get("/product/:id", isAuthenticate, isAdmin, getOneProduct);

router.post("/product", upload.array('image',2), addProduct);

router.put("/product/:id", upload.array('image',2), updateProduct);

router.delete("/product/:id", deleteProduct);

// Orders

router.get("/orders", isAdmin, getAllOrders);

router.route("/orders/:orderID")
  .get(isAdmin, getOrder)
  .put(isAdmin,updateOrderStatus)
  .delete(isAdmin,orderCancel)


module.exports = router;
