const Note = require("../models/Note");
const Label = require("../models/Label");
const fs = require("fs");
const path = require("path");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.getNote = async (req, res, next) => {
  try {
    const notes = await Note.find({ creator: req.userId });
    const sub = req.get("Subcription");
    notes.map((note) => {
      if (note.remind) {
        let now = new Date().getTime();
        let remindTime = new Date(note.remind).getTime();
        let remainingTime = remindTime - now;
        const payload = JSON.stringify({
          title: note.title,
          content: note.content,
        });

        if (remainingTime > 0) {
          setTimeout(() => {
            req.sendNoti.sendNotification(JSON.parse(sub), payload);
          }, remainingTime);
        }
      }
    });

    await res.status(200).json({
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

exports.searchNote = async (req, res, next) => {
  try {
    const { keyWord } = req.body;

    const regex = new RegExp(keyWord);
    const notes = await Note.find({ title: regex, creator: req.userId });

    await res.status(200).json({
      message: "Fetched notes successfully",
      notes: notes,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const { title, content, labelId, remind, labelName } = req.body;

    const imageUrl = req.file?.path;
    if (title.length === 0 && content.length === 0) {
      return res.status(400).send("Please check your request");
    }

    if (labelId) {
      let label = await Label.findOne({
        _id: labelId,
      });

      const note = await Note.create({
        title: title,
        content: content,
        creator: req.userId,
        labelId: label._id,
        remind: remind,
        imageUrl: imageUrl,
      });
    } else {
      if (labelName) {
        const label = await Label.findOne({ labelName: labelName });

        if (!label) {
          const label = await Label.create({
            labelName: labelName,
            creator: req.userId,
          });
          const note = await Note.create({
            title: title,
            content: content,
            creator: req.userId,
            labelId: label._id,
            remind: remind,
            imageUrl: imageUrl,
          });
        } else {
          const note = await Note.create({
            title: title,
            content: content,
            creator: req.userId,
            labelId: label._id,
            remind: remind,
            imageUrl: imageUrl,
          });
        }
      } else {
        const note = await Note.create({
          title: title,
          content: content,
          creator: req.userId,
          remind: remind,
          imageUrl: imageUrl,
        });
      }
    }

    const newArrLabel = await Label.find({ creator: req.userId });
    const newArrNote = await Note.find({ creator: req.userId });

    await res.status(201).json({
      message: "Create note successfully!",
      newArrLabel,
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
    const { _id, title, content, creator, remind, labelName } = req.body;
    const imageUrl = req.file?.path;

    const note = await Note.findOne({ _id: _id });

    if (creator != req.userId.toString()) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    if (labelName) {
      const label = await Label.findOne({
        labelName: labelName,
        creator: req.userId,
      });

      if (label) {
        await Note.findByIdAndUpdate(
          { _id: _id },
          {
            $set: {
              title: title,
              content: content,
              remind: remind,
              labelId: label._id,
              imageUrl: imageUrl,
            },
          }
        );
      } else {
        const newLabel = await Label.create({
          labelName,
          creator: req.userId,
        });
        await Note.findByIdAndUpdate(
          { _id: _id },
          {
            $set: {
              title: title,
              content: content,
              remind: remind,
              labelId: newLabel._id,
              imageUrl: imageUrl,
            },
          }
        );
      }
    } else {
      await Note.findByIdAndUpdate(
        { _id: _id },
        {
          $set: {
            title: title,
            content: content,
            remind: remind,
            imageUrl: imageUrl,
          },
        }
      );
    }
    const newArrLabel = await Label.find({ creator: req.userId });
    const newArrNote = await Note.find({ creator: req.userId });
    await res
      .status(200)
      .json({ message: "Note have been edited", newArrNote, newArrLabel });
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

exports.clearLabelName = async (req, res, next) => {
  try {
    const { _id, creator } = req.body;

    if (creator != req.userId) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }

    const note = await Note.findByIdAndUpdate(
      { _id: _id },
      { $unset: { labelId: "" } }
    );

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

exports.clearImage = async (req, res, next) => {
  const { _id, creator } = req.body;
  if (creator != req.userId) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }

  const note = await Note.findOne({ _id: _id });
  if (note.imageUrl) {
    clearImage(note.imageUrl);
  }
  await Note.findByIdAndUpdate({ _id: _id }, { $unset: { imageUrl: "" } });
  const newArrNote = await Note.find({ creator: req.userId });
  await res
    .status(200)
    .json({ message: "Image have been deleted", newArrNote: newArrNote });
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
