const express = require("express");
const router = express.Router();

const verify = require("../middleware/verify");
const labelController = require("../controllers/labelController");

router.get("/", verify, labelController.getLabel);

router.post("/get-name", verify, labelController.getLabelName);

router.post("/create", verify, labelController.createLabel);

router.post("/edit", verify, labelController.editLabel);

router.delete("/delete", verify, labelController.deleteLabel);

module.exports = router;
