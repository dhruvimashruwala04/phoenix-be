const express = require("express");
const { getMe, updateUser } = require("../controller/user.controller");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/me", authenticateToken, getMe);
router.patch("/update", authenticateToken, updateUser);

module.exports = router;
