const AppError = require("./AppError");

const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return next(new AppError("Please enter name.", 400));
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailPattern.test(email.trim())) {
    return next(new AppError("Please enter a valid email.", 400));
  }

  if (typeof password !== "string" || password.length < 8) {
    return next(new AppError("Please enter password of 8+ characters.", 400));
  }

  next();
};

module.exports = validateSignup;
