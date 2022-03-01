const Note = require("../models/Note");
const User = require("../models/User");

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
    const { title, content } = req.body;

    const note = await Note.create({
      title: title,
      content: content,
      creator: req.userId,
    });
    const user = await User.findById(req.userId);
    user.note.push(note);
    user.save();
    await res.status(201).json({
      message: "Create note successfully!",
      note: note,
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
    const { note_id, title, content, creator } = req.body;

    if (creator != req.userId) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    await Note.findByIdAndUpdate(
      { _id: note_id },
      { $set: { title: title, content: content } }
    );
    await res.status(200).json({ message: "Note have been edited" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
