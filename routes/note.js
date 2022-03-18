const express = require("express");
const verify = require("../middleware/verify");

const noteController = require("../controllers/noteController");

const router = express.Router();

router.get("/", verify, noteController.getNote);

router.post("/create", verify, noteController.createNote);

router.post("/edit", verify, noteController.editNote);

router.put("/archive", verify, noteController.archiveNote);

router.put("/unarchive", verify, noteController.unArchiveNote);

router.put("/restore", verify, noteController.restoreNote);

router.delete("/delete", verify, noteController.deleteNote);

router.delete("/empty", verify, noteController.emptyTrash);

module.exports = router;
