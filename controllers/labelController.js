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

exports.createLabel = async (req, res, next) => {
  try {
    const { label_name } = req.body;

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
    const { label_name, label_id, labelChange } = req.body;

    const noteInLabel = await Note.find({ label_name: label_name });

    await noteInLabel.map((note) => {
      note.label_name = labelChange;
      note.save();
    });

    const labelUpdated = await Label.findOneAndUpdate(
      { label_name: label_name },
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
    const { label_name } = req.body;

    const labelDelete = await Label.findOneAndRemove({
      label_name: label_name,
    });
    console.log(label_name);
    const noteInLabel = await Note.find({ label_name: label_name });

    noteInLabel.map((note) => {
      note.label_name = null;
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
