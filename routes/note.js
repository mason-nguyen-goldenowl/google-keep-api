const express = require("express");
const verify = require("../middleware/verify");

const noteController = require("../controllers/noteController");

const router = express.Router();

router.get("/", verify, noteController.getNote);

router.post("/create", verify, noteController.createNote);

router.post("/edit", verify, noteController.editNote);

module.exports = router;
