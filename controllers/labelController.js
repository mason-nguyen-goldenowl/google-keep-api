const Label = require("../models/Label");
const Note = require("../models/Note");

exports.getLabel = async (req, res, next) => {
  try {
    const labels = await Label.find({ creator: req.userId });
    res.status(200).json({
      message: "Fetched labels successfully",
      labels: labels,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getLabelName = async (req, res, next) => {
  try {
    const { label_id } = req.body;
    const label = await Label.findOne({ _id: label_id });
    res.status(200).json({ labelName: label.label_name });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createLabel = async (req, res, next) => {
  try {
    const { label_name } = req.body;
    const label = await Label.findOne({ label_name, creator: req.userId });

    if (label) {
      return res.status(400).send("Label have already exist");
    }
    await Label.create({
      label_name: label_name,
      creator: req.userId,
    });
    const newArrLabel = await Label.find({ creator: req.userId });
    await res.status(201).json({
      message: "Create label successfully!",
      newArrLabel,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editLabel = async (req, res, next) => {
  try {
    const { label_id, labelChange } = req.body;

    await Label.findOneAndUpdate(
      { _id: label_id },
      { $set: { label_name: labelChange } }
    );

    const newArrLabels = await Label.find({ creator: req.userId });
    const newArrNote = await Note.find({ creator: req.userId });

    await res.status(201).json({
      message: "Edit label successfully!",
      newArrLabels,
      newArrNote,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteLabel = async (req, res, next) => {
  try {
    const { label_id } = req.body;
    await Label.findOneAndRemove({
      _id: label_id,
      creator: req.userId,
    });

    const noteInLabel = await Note.find({
      label_id: label_id,
      creator: req.userId,
    });

    noteInLabel.map((note) => {
      note.label_name = null;
      note.label_id = null;
      note.save();
    });
    const newArrLabels = await Label.find({ creator: req.userId });
    const newArrNote = await Note.find({ creator: req.userId });
    await res.status(201).json({
      message: "Delete label successfully!",
      newArrLabels,
      newArrNote,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
