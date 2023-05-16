const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Admin = require("../Models/adminModel");
const User = require("../Models/userModel");

// User auth
exports.isAuthenticate = async (req, res, next) => {
  if (req.cookies && req.cookies.token) {
    try {
      // 1) Verify user token or admin token
      let decoded;
      let currentUser;
      if (req.cookies.token) {
        decoded = await promisify(jwt.verify)(
          req.cookies.token,
          process.env.JWT_SECRET
        );
        currentUser = await User.findById(decoded.id);
      }

      if (currentUser.isBlock) {
        res.clearCookie("token");

        // Send a response indicating success
        res.status(200).json({ message: 'Your account is blocked. Please contact the administrator.' });
      }

      // 2) Check if user or admin still exists
      if (!currentUser) {
        return next();
      }

      // THERE IS A LOGGED IN USER/ADMIN

      req.user = currentUser;
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// User auth
exports.isAdmin = async (req, res, next) => {
  if (req.cookies && req.cookies.admin) {
    try {
      // 1) Verify user token or admin token
      let decoded;
      let currentUser;
      if (req.cookies.admin) {
        decoded = await promisify(jwt.verify)(
          req.cookies.admin,
          process.env.JWT_SECRET
        );
        currentUser = await Admin.findById(decoded.id);
      }

      // 2) Check if user or admin still exists
      if (!currentUser) {
        return next();
      }

      // THERE IS A LOGGED IN USER/ADMIN

      req.admin = currentUser;
      res.locals.admin = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
