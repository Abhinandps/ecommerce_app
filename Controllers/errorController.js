module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Check if the error is a Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = {};

    // Loop through each error and add to the errors object
    for (let field in err.errors) {
      errors[field] = err.errors[field].message;
    }

    // Return the errors as JSON
    return res.status(400).json({
      status: "fail",
      message: errors,
    });
  }

  // Check if the error is a duplicate key error
  if (err.code === 11000) {
    const errors = {};
    for (let field in err.keyValue) {
      console.log(err.keyValue)
      errors[field] = `${field} already exist`;
    }

    // Return the error as JSON
    return res.status(400).json({
      status: "fail",
      message: errors,
    });
  }

  // Check if the error is a custom error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
