const path = require("path");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');


const AppError = require("./utils/appError");
const globalErrorHandler = require("./Controllers/errorController");
const userRouter = require("./Routes/userRoutes");
const adminRouter = require("./Routes/adminRoutes");
const viewRouter = require("./Routes/viewRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// load static assets
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use(cors());


app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All Routes
app.use("/", viewRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

// Error Route
app.all("*", (req, res, next) => {
  res.render("user/404.ejs");
});

app.use(globalErrorHandler);

module.exports = app;
