const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/refresh", authController.refreshUserToken);

router.post("/request-reset-password", authController.requestResetPassword);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
