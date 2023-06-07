const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "user must have a username"],
    validate: {
      validator: function (value) {
        return /^[A-Za-z]+$/.test(value);
      },
      message: "Please provide a valid username.",
    },
  },
  avatar: {
    type: String,
    default: 'src/images/avatar.png'
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: [true, "user must have a email"],
    unique: true,
  },
  mobile: {
    type: String,
    required: [true, "Please provide a mobile number"],
    unique: true,
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value);
      },
      message: "Please provide a valid 10-digit phone number.",
    },
  },
  password: {
    type: String,
    required: [true, "user must have a password"],
    minLength: [4, "Password must be at least 4 characters long"],
  },
  otp: {
    type: String,
    default: null,
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
