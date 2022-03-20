const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetCodeSchema = new Schema({
  resetCode: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  resetPassAt: { type: Date, index: { expires: "20m" } },
});

module.exports = mongoose.model("ResetCode", resetCodeSchema);
