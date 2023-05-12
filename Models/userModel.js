const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "user must have a username"],
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: [true, "user must have a email"],
    unique: true,
  },
  mobile: {
    type: String,
    required: [true, 'Please provide a mobile number'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "user must have a password"],
    minLength: [3, "Password must be at least 3 characters long"],
  },
  otp: {
    type: String,
  default:null
  },
});

userSchema.pre("save", async function (next) {
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
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
