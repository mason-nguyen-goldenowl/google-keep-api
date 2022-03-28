import express from "express";
import verify from "../middleware/verify.js";
import uploadFile from "../middleware/uploadFile.js";
import webPush from "../middleware/webPush.js";
import {
	archiveNote,
	removeNote,
	restoreNote,
	deleteNote,
	clearImage,
	clearLabelName,
	clearRemind,
	createNote,
	editNote,
	emptyTrash,
	getNote,
	searchNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.get("/", verify, webPush, getNote);

router.post("/search", verify, searchNote);

router.post("/create", verify, uploadFile.single("image"), createNote);

router.post("/edit", verify, uploadFile.single("image"), editNote);

router.put("/archive", verify, archiveNote);

router.put("/restore", verify, restoreNote);

router.delete("/delete", verify, deleteNote);

router.delete("/clear-remind", verify, clearRemind);

router.delete("/clear-label", verify, clearLabelName);

router.delete("/clear-image", verify, clearImage);

router.delete("/remove", verify, removeNote);

router.delete("/empty", verify, emptyTrash);

export default router;
