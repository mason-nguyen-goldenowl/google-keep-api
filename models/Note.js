const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "",
    },
    content: {
      type: String,
      required: true,
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
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
