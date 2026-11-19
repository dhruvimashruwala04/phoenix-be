const { pool } = require("../config/database");
const AppError = require("../middleware/AppError");
const User = require("../models/user.model");

const getMe = async (req, res, next) => {
  try {
    const result = await User.findByPk(req.user.userId, {
      attributes: { exclude: ["password"] },
    });
    res
      .status(200)
      .json({ success: true, message: "User found.", data: result });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const allowedFields = [
      "name",
      "email",
      "avatar",
      "department",
      "job_title",
      "team_size",
    ];

    const updates = [];
    const values = [];
    const entries = Object.entries(req.body);

    // if (entries.length === 0) {
    //   return next(new AppError("No fields provided to update.", 400));
    // }

    for (const [key, value] of entries) {
      if (!allowedFields.includes(key)) {
        return next(new AppError(`Invalid field: ${key}`, 400));
      }
      values.push(value);
      updates.push(`${key} = $${values.length}`);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(userId);

    const query = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING id, name, email, avatar, department, job_title, team_size
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return next(new AppError("User not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return next(new AppError("Email already exists.", 409));
    }
    next(error);
  }
};

module.exports = { getMe, updateUser };
