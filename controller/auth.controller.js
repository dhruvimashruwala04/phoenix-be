const { pool } = require("../config/database");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const AppError = require("../middleware/AppError");
const { hashPassword, comparePassword } = require("../utils/password");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return next(new AppError("User already exists.", 409));
    }
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return next(new AppError("Invalid credentials.", 401));
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    const userData = user.toJSON();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      token,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, loginUser };
