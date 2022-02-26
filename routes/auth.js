const express = require("express");
const { body } = require("express-validator/check");
const authController = require("../controllers/authController");
const User = require("../models/user");

const router = express.Router();

router.post("/signup", authController.signup);

module.exports = router;
