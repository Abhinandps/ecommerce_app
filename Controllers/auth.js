const User = require("../Models/userModel");

const jwt = require("jsonwebtoken");

const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ErrorHandler = require("../Controllers/errorController");

function generateNumericOTP(length) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
}

const signToken = (id) =>
  jwt.sign(
    { id: id }, // payload
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

const sendOTP = (otp, user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: user.email,
    subject: "Verify your email address",
    text: `Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

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
  res.cookie("token", token, cookieOptions);

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

// User signup
exports.signup = catchAsync(async (req, res, next) => {
  // Save requested data and hashed password to the database
  const newUser = await User.create(req.body);

  // Generate an OTP and store it in the user object

  const otp = generateNumericOTP(4)

  newUser.otp = otp;
  await newUser.save();

  // Send the OTP to the user's email address
  sendOTP(otp, newUser);

  res.json({ status: "success" });
}, ErrorHandler);

// Verify the OTP
exports.verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    console.log("not found");
    return next(new AppError(`User not found`, 400));
  }

  if (user.otp !== otp) {
    return next(new AppError(`Invalid OTP`, 400));
  }

  user.otp = null;
  await user.save();

  // Send Token To Client
  createSendToken(user, 200, res);
};

// validate

exports.validate = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(`User not found`, 400));
  }

  if (user.isBlock) {
    return next(
      new AppError(`Your account has been blocked. Please contact support`, 401)
    );
  }

  res.status(200).json({ status: "success" });
}, ErrorHandler);

// User Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check the email and password exist
  if (!email || !password) {
    return next(new AppError(`Please provide email and password!`, 400));
  }

  // 2) Check if user exist and password is incorrect
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(`Incorrect email or password`, 401));
  }

  if (user.isBlock) {
    return next(
      new AppError(`Your account has been blocked. Please contact support`, 401)
    );
  }

  
  if (typeof user.otp === 'string' && user.otp.trim() !== '') {
    return next(new AppError('Something wrong login through OTP'));
  }


  // 3) if everything ok, send token to client
  createSendToken(user, 200, res);

  // Create a new session for the user
  req.session.userId = 1;
}, ErrorHandler);

// User generateOTP
exports.generateOTP = catchAsync(async (req, res, next) => {
  const email = req.body.email;

  // 2) Check if user exist
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError(`User not found`, 400));
  }

  if (user.isBlock) {
    return next(
      new AppError(`Your account has been blocked. Please contact support`, 401)
    );
  }

  if (user) {
    // Generate an OTP and store it in the user object
    const otp = generateNumericOTP(4);
    user.otp = otp;
    await user.save();

    // Send the OTP to the user's email address
    sendOTP(otp, user);

    res.json({
      status: "success",
    });
  }
});

// User Logout
exports.logout = (req, res) => {
  // Remove the JWT from the client's local storage
  res.clearCookie("token");

  // Send a response indicating success
  res.status(200).json({ status: "success" });
};
