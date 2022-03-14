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
    const { title, content, label_name, remind } = req.body;

    if (label_name) {
      let label = await Label.findOne({ label_name });

      if (!label) {
        label = await Label.create({
          label_name: label_name,
          creator: req.userId,
        });
      }
    }
    const note = await Note.create({
      title: title,
      content: content,
      creator: req.userId,
      label_name: label_name,
      remind: remind,
    });

    if (label_name) {
      const label = await Label.findOne({ label_name: label_name });
      label.note.push(note._id);
      label.save();
    }

    const user = await User.findOne({ _id: req.userId });

    user.note.push(note._id);
    user.save();
    const newArrNote = await Note.find({ creator: req.userId });
    console.log(req.cookies);
    await res.status(201).json({
      message: "Create note successfully!",
      note: note,
      label_name: label_name,
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
    console.log("cre", req.body);
    console.log("user", req.userId);
    if (creator != req.userId) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    await Note.findByIdAndUpdate({ _id: _id }, { $unset: { remind: "" } });
    console.log("clear");
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

    const noteremove = await Note.findOneAndRemove({ _id: note_id });

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
    const notes = await Note.find({ deleted: true });
    const user = await User.findOne({ _id: req.userId });

    let notesTrashId = [];
    const promise = async () => {
      const unresolved = notes.map(async (noteDelete) => {
        notesTrashId.push(noteDelete._id.toString());

        const labelOfDeletedNote = await Label.findOne({
          label_name: noteDelete.label_name,
        });

        const noteLabelIndex = await labelOfDeletedNote.indexOf(
          noteDelete._id.toString()
        );

        await labelOfDeletedNote.note.splice(noteLabelIndex, 1);
        labelOfDeletedNote.save();

        const noteDeleteInUserIndex = user.note.indexOf(noteDelete._id);

        user.note.splice(noteDeleteInUserIndex, 1);
        user.save();
      });
      const resolved = await Promise.all(unresolved);
    };
    await Note.deleteMany({ deleted: true });

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
