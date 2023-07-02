const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ErrorHandler = require("../Controllers/errorController");
const twilio = require("twilio");

const User = require("../Models/userModel");
const Cart = require("../Models/cartModel");
const GuestUser = require("../Models/guestUser");

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

const sendMobileOTP = async (otp, mobileNumber, res) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const message = await client.messages.create({
      body: `Your OTP: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${mobileNumber}`,
    });

    console.log("OTP sent successfully!", message.sid);

    res.json({
      status: "success",
      message: `OTP is sent to your ${mobileNumber} successfully`,
    });
  } catch (error) {
    // Handle specific error cases
    if (error.code === 21614) {
      return res
        .status(401)
        .json({ status: "fail", message: "Invalid mobile number" });
    } else if (error.code === 21211) {
      return res
        .status(401)
        .json({ status: "fail", message: "Mobile number is not registered" });
    } else {
      console.error("Error sending OTP:", error);
      return res.status(500).json({ error: "Error sending OTP" });
    }
  }
};

const createSendToken = async (user, statusCode, res, req) => {
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

  // handle guest user

  const guestUserID = req.cookies.guestUserID;
  if (guestUserID) {
    const guestUser = await GuestUser.findOne({ guestUserID });
    res.clearCookie("guestUserID");
    (async () => {
      const user = await findUserFromToken(token);
      // console.log(user);
      let cart = await Cart.findOne({ user: user._id });
      if (cart) {
        cart.items = guestUser.items;
        cart.totalPrice = guestUser.totalPrice;
        await cart.save();
      } else {
        // Create a new cart if it doesn't exist for the user
        cart = new Cart({ user: user._id, items: [] });
        cart.items = guestUser.items;
        cart.totalPrice = guestUser.totalPrice;
        await cart.save();
      }

      // Remove the guestUser document from the database
      await GuestUser.findOneAndRemove({ guestUserID });
    })();
  }

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      data: user,
    },
  });
};

const findUserFromToken = async (token) => {
  try {
    // Decode the token to extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the user based on the user ID
    const user = await User.findById(userId);

    return user;
  } catch (error) {
    // Handle error if the token is invalid or user is not found
    console.log("Error finding user from token:", error);
    return null;
  }
};

// User signup
exports.signup = catchAsync(async (req, res, next) => {
  const { password, confirmpassword } = req.body;
  // Check if the passwords match

  if (password !== confirmpassword) {
    return res
      .status(400)
      .json({ message: { confirmPassword: "Passwords do not match" } });
  }

  // Save requested data and hashed password to the database
  const newUser = await User.create(req.body);

  // Generate an OTP and store it in the user object
  const otp = generateNumericOTP(4);

  newUser.otp = otp;
  await newUser.save();

  // Send the OTP to the user's mobile number
  // sendMobileOTP(otp, newUser.mobile);

  // Send the OTP to the user's email address
  sendOTP(otp, newUser, res);

  res.json({ status: "success" });
}, ErrorHandler);

// Verify the OTP
exports.verifyOTP = async (req, res, next) => {
  const { email, phoneNumber, otp } = req.body;

  let user;

  if (email) {
    user = await User.findOne({ email });
  } else if (phoneNumber) {
    user = await User.findOne({ mobile: phoneNumber });
  }

  if (!user) {
    console.log("not found");
    return next(new AppError(`User not found`, 400));
  }

  if (user.otp !== otp) {
    return next(new AppError(`Invalid OTP`, 400));
  }
  // Check if OTP is expired
  if (user.isOTPExpired) {
    // Clear the expired OTP
    user.clearOTP();
    await user.save();
    return next(new Error(`OTP has expired`));
  }

  // Clear the valid OTP
  user.clearOTP();
  await user.save();

  // Send Token To Client
  createSendToken(user, 200, res, req);
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

  if (typeof user.otp === "string" && user.otp.trim() !== "") {
    return next(new AppError("Something wrong login through OTP"));
  }

  // 3) if everything ok, send token to client
  createSendToken(user, 200, res, req);
}, ErrorHandler);

// User generateOTP
exports.generateOTP = catchAsync(async (req, res, next) => {
  const { preferredMethod, contactData } = req.body;

  // console.log(preferredMethod, contactData.phone);

  if (preferredMethod === "email") {
    // 2) Check if user exist
    const user = await User.findOne({ email: contactData.email }).select(
      "+password"
    );

    if (!user) {
      return next(new AppError(`Email not registered. Please register.`, 400));
    }

    if (user.isBlock) {
      return next(
        new AppError(
          `Your account has been blocked. Please contact support`,
          401
        )
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
        message: `OTP is sent to your email address (${user.email}) successfully`,
      });
    }
  } else if (preferredMethod === "phone") {
    // 2) Check if user exist
    const user = await User.findOne({ mobile: contactData.phone }).select(
      "+password"
    );

    if (!user) {
      return next(new AppError(`Mobile number is not registered`, 400));
    }

    if (user.isBlock) {
      return next(
        new AppError(
          `Your account has been blocked. Please contact support`,
          401
        )
      );
    }

    if (user) {
      // Generate an OTP and store it in the user object
      const otp = generateNumericOTP(4);
      user.otp = otp;
      await user.save();

      // Send the OTP to the user's mobile number
      sendMobileOTP(otp, contactData.phone, res);
    }
  } else {
    return next(new AppError(`Invalid preferred contact method`, 400));
  }

  // res.json({
  //   status: "success",
  //   message: `OTP is sent to Your ${preferredMethod} successfully`,
  // });
});

// User Logout
exports.logout = (req, res) => {
  // Remove the JWT from the client's local storage
  res.clearCookie("token");

  // Send a response indicating success
  res.status(200).json({ status: "success" });
};
