const path = require('path');
const express = require("express");
const app = express();
const session = require("express-session");

const AppError = require("./utils/appError");
const globalErrorHandler = require('./Controllers/errorController')
const userRouter = require("./Routes/userRoutes");
const adminRouter = require("./Routes/adminRoutes");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// load static assets
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // set to true for HTTPS
  })
);

app.use(express.json());

// All Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

// Error Route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find the ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
