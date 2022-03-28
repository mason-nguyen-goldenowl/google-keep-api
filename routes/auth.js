import express from "express";

import {
	signup,
	login,
	refreshUserToken,
	requestResetPassword,
	resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/refresh", refreshUserToken);

router.post("/request-reset-password", requestResetPassword);

router.post("/reset-password", resetPassword);

export default router;
