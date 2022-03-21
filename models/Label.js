const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labelSchema = new Schema(
  {
    labelName: { type: String, required: true },

    creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Label", labelSchema);
