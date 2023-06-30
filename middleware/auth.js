const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Admin = require("../Models/adminModel");
const User = require("../Models/userModel");
const { generateGuestID } = require("../utils/guestUtils");
const GuestUser = require("../Models/guestUser");


// User auth
// ================
exports.isAuthenticate = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      let currentUser = await User.findById(decoded.id);

      if (currentUser.isBlock) {
        res.clearCookie("token");

        // Send a response indicating success
        res.status(200).json({
          message: "Your account is blocked. Please contact the administrator.",
        });
      }
      if (!currentUser) {
        return next();
      }

      // THERE IS A LOGGED IN USER

      req.user = currentUser;
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  } else {
    // Guest user
    const guestUserID = req.cookies.guestUserID; // Retrieve the guest user ID from the cookie

    if (guestUserID) {
      // Guest user exists, retrieve guest user's information from the database based on the guestUserID
      const guestUser = await GuestUser.findOne({ guestUserID });
      if (guestUser) {
        req.user = guestUser; // Attach the guest user object to the request object
        res.locals.user = guestUser;
      } else {
        // Handle case when guest user ID is not found in the database
        // You can create a new guest user entry in the database if needed
      }
    } else {
      const newGuestUserID = generateGuestID();
      const maxAgeInMinutes = 60 * 24; // 24 hours
      const maxAgeInMilliseconds = maxAgeInMinutes * 60 * 1000;

      res.cookie("guestUserID", newGuestUserID, {
        maxAge: maxAgeInMilliseconds,
        httpOnly: true,
      });

      const guestUser = new GuestUser({
        guestUserID: newGuestUserID,
        items: [],
        role: "guest",
      });

      try {
        await guestUser.save();
        req.user = guestUser;
        res.locals.user = guestUser;
      } catch (err) {
        console.error(err);
      }
    }
  }
  next();
};



// Admin auth
// =================
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
