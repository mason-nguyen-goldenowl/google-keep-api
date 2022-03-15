const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labelSchema = new Schema(
  {
    label_name: { type: String, required: true },

    creator: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Label", labelSchema);
