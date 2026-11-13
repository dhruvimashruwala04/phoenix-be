const { pool } = require("../config/database");
const AppError = require("../middleware/AppError");

const getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM users
       WHERE id = $1`,
      [req.user.userId],
    );

    if (result.rows.length === 0) {
      return next(new AppError("User not found.", 404));
    }

    res
      .status(200)
      .json({ success: true, message: "User found.", data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe };
