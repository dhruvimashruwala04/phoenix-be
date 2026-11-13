const { pool } = require("../config/database");
const jwt = require("jsonwebtoken");
const AppError = require("../middleware/AppError");
const { hashPassword, comparePassword } = require("../utils/password");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, hashedPassword],
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
    });
  } catch (error) {
    if (error.code === "23505") {
      return next(new AppError("User already exists.", 409));
    }
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length === 0) {
      return next(new AppError("Invalid credentials.", 401));
    }

    const user = result.rows[0];

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return next(new AppError("Invalid credentials.", 401));
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, loginUser };
