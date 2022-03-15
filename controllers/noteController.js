const Note = require("../models/Note");
const User = require("../models/User");
const Label = require("../models/Label");

exports.getNote = async (req, res, next) => {
  try {
    const notes = await Note.find({ creator: req.userId });
    res.status(200).json({
      message: "Fetched notes successfully",
      notes: notes,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const { title, content, label_id, remind } = req.body;

    if (title.length === 0 && content.length === 0) {
      return res.status(400).send("Please check your request");
    }

    if (label_id) {
      let label = await Label.findOne({ _id: label_id });

      const note = await Note.create({
        title: title,
        content: content,
        creator: req.userId,
        label_id: label._id,
        remind: remind,
      });
    } else {
      const note = await Note.create({
        title: title,
        content: content,
        creator: req.userId,
        remind: remind,
      });
    }

    const newArrNote = await Note.find({ creator: req.userId });

    await res.status(201).json({
      message: "Create note successfully!",

      newArrNote: newArrNote,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editNote = async (req, res, next) => {
  try {
    const { _id, title, content, creator, remind } = req.body;

    if (creator != req.userId) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    await Note.findByIdAndUpdate(
      { _id: _id },
      { $set: { title: title, content: content, remind: remind } }
    );

    const newArrNote = await Note.find({ creator: req.userId });
    await res
      .status(200)
      .json({ message: "Note have been edited", newArrNote });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.archiveNote = async (req, res, next) => {
  try {
    const { note_id } = req.body;

    const noteArchive = await Note.findOne({ _id: note_id });

    if (noteArchive.archive === true) {
      await Note.findByIdAndUpdate(
        { _id: note_id },
        { $set: { archive: false } }
      );
    } else {
      await Note.findByIdAndUpdate(
        { _id: note_id },
        { $set: { archive: true } }
      );
    }
    const newArrNote = await Note.find({ creator: req.userId });
    await res
      .status(200)
      .json({ message: "Note have been archived", newArrNote: newArrNote });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const { note_id } = req.body;

    await Note.findOneAndUpdate(
      { _id: note_id },
      { $set: { deleted: true, deletedAt: Date.now() } }
    );
    const newArrNote = await Note.find({ creator: req.userId });
    await res
      .status(200)
      .json({ message: "Note have been deleted", newArrNote: newArrNote });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.clearRemind = async (req, res, next) => {
  try {
    const { _id, creator } = req.body;

    if (creator != req.userId) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    await Note.findByIdAndUpdate({ _id: _id }, { $unset: { remind: "" } });

    const newArrNote = await Note.find({ creator: req.userId });
    await res
      .status(200)
      .json({ message: "Remind have been deleted", newArrNote: newArrNote });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.removeNote = async (req, res, next) => {
  try {
    const { note_id } = req.body;

    await Note.findOneAndRemove({ _id: note_id });

    const newArrNote = await Note.find({ creator: req.userId });

    await res
      .status(200)
      .json({ message: "Note have been removed", newArrNote: newArrNote });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.restoreNote = async (req, res, next) => {
  try {
    const { note_id } = req.body;

    await Note.findOneAndUpdate(
      { _id: note_id },
      { $set: { deleted: false, deletedAt: null } }
    );
    const newArrNote = await Note.find({ creator: req.userId });
    await res
      .status(200)
      .json({ message: "Note have been restored", newArrNote: newArrNote });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.emptyTrash = async (req, res, next) => {
  try {
    const noteTrashId = req.body;
    await Note.deleteMany({ _id: { $in: noteTrashId } });

    const newArrNote = await Note.find({ creator: req.userId });
    await res
      .status(200)
      .json({ message: "Trash have been empty", newArrNote: newArrNote });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
