const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labelSchema = new Schema(
  {
    label_name: { type: String, required: true, unique: true },
    note: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Label", labelSchema);
