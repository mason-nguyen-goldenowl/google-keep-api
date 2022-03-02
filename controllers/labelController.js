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

    const label = await Label.create({
      label_name: label_name,
      creator: req.userId,
    });

    await res.status(201).json({
      message: "Create label successfully!",
      label,
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
    const { label_name, label_id } = req.body;

    const noteInLabel = await Note.find({ label_name: label_name });

    await noteInLabel.map((note) => {
      note.label_name = label_name;
      note.save();
    });

    const labelUpdated = await Label.findOneAndUpdate(
      { _id: label_id },
      { $set: { label_name: label_name } }
    );

    await res.status(201).json({
      message: "Edit label successfully!",
      labelUpdated: labelUpdated,
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

    const noteInLabel = await Note.find({ label_name: label_name });

    noteInLabel.map((note) => {
      note.label_name = null;
      note.save();
    });

    await res.status(201).json({
      message: "Delete label successfully!",

      noteInLabel,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
