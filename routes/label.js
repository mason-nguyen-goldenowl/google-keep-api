import express from "express";
import {
	getLabel,
	getLabelName,
	createLabel,
	editLabel,
	deleteLabel,
} from "../controllers/labelController.js";
import verify from "../middleware/verify.js";

const router = express.Router();

router.get("/", verify, getLabel);

router.post("/get-name", verify, getLabelName);

router.post("/create", verify, createLabel);

router.post("/edit", verify, editLabel);

router.delete("/delete", verify, deleteLabel);

export default router;
