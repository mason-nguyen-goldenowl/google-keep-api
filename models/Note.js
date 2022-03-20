const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    remind: {
      type: Date,
    },

    labelId: {
      type: Schema.Types.ObjectId,
      ref: "labels",
    },
    archive: {
      type: Boolean,
    },
    deleted: {
      type: Boolean,
    },
    deletedAt: {
      type: Date,
      index: { expires: "7d" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
