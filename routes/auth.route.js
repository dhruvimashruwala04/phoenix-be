const express = require("express");
const { createUser, loginUser } = require("../controller/auth.controller");
const validateSignup = require("../middleware/validateSignup");
const router = express.Router();

router.post("/signup", validateSignup, createUser);
router.post("/login", loginUser);

module.exports = router;
