const express = require("express");
const verify = require("../middleware/verify");

const noteController = require("../controllers/noteController");
const uploadFile = require("../middleware/uploadFile");

const router = express.Router();

router.get("/", verify, noteController.getNote);

router.post("/search", verify, noteController.searchNote);

router.post(
  "/create",
  verify,
  uploadFile.single("image"),
  noteController.createNote
);

router.post(
  "/edit",
  verify,
  uploadFile.single("image"),
  noteController.editNote
);

router.put("/archive", verify, noteController.archiveNote);

router.put("/restore", verify, noteController.restoreNote);

router.delete("/delete", verify, noteController.deleteNote);

router.delete("/clear-remind", verify, noteController.clearRemind);

router.delete("/clear-label", verify, noteController.clearLabelName);

router.delete("/clear-image", verify, noteController.clearImage);

router.delete("/remove", verify, noteController.removeNote);

router.delete("/empty", verify, noteController.emptyTrash);

// router.post("/uploads", uploadFile.single("image"));

module.exports = router;
