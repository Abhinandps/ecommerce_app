
const express = require("express");
const router = express.Router();

const { getAdminLogin, getDashboard,getUsers,getAllCategories } = require("../Controllers/viewController");


// ADMIN VIEW
router.get('/admin/login',getAdminLogin);

router.get('/dashboard', getDashboard);

router.get('/users', getUsers);

router.get('/category', getAllCategories)

module.exports = router;

