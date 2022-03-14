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
    },
    remind: {
      type: Date,
    },
    label_name: {
      type: String,
      ref: "Label",
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
