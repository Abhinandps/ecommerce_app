const Admin = require("../Models/adminModel");

const jwt = require("jsonwebtoken");
const { promisify } = require('util');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ErrorHandler = require("../Controllers/errorController");



const signToken = (id) =>
  jwt.sign(
    { id: id }, // payload
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );


const createSendToken = (user, statusCode, res) => {
    // Generate a JWT containing the user's ID
    const token = signToken(user._id);
  
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: true,
    };
  
    // Store the JWT in the client's local storage
    res.cookie("admin", token, cookieOptions);
  
    // Remove password from response
    user.password = undefined;
  
    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        data: user,
      },
    });
  };
  


// Admin register
exports.register = catchAsync(async (req, res, next) => {
    // Save requested data and hashed password to the database
   const admin = await Admin.create(req.body);

//  if everything ok, send token to client
  createSendToken(admin, 200, res);

  });


  // Admin Login
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
 
  // 1) Check the username and password exist
  if (!username || !password) {
    return next(new AppError(`Please provide username and password!`, 400));
  }

  // 2) Check if user exist and password is incorrect
  const admin = await Admin.findOne({ username }).select("+password");


  if (!admin || !(await admin.correctPassword(password, admin.password))) {
    return next(new AppError(`Incorrect username or password`, 401));
  }

  // 3) if everything ok, send token to client
  createSendToken(admin, 200, res);

},ErrorHandler);


// Admin Logout
exports.logout = (req, res) => {
  // Remove the JWT from the client's local storage
  res.clearCookie("admin");

  // Send a response indicating success
  res.status(200).json({ status: "success" });
};


// Authentication

exports.isAdmin = async (req, res, next) => {
  if (req.cookies.admin) {
   
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.admin,
        process.env.JWT_SECRET
      );

      // 2) Check if admin still exists
      const currentAdmin = await Admin.findById(decoded.id);
      if (!currentAdmin) {
        return next();
      }

      // THERE IS A LOGGED IN Admin
      req.admin = currentAdmin;
      res.locals.admin = currentAdmin;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};


