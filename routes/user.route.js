const express = require("express");
const { getMe } = require("../controller/user.controller");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/me", authenticateToken, getMe);

module.exports = router;
