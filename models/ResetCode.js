const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetCodeSchema = new Schema({
  reset_code: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  resetPassAt: { type: Date, index: { expires: "20m" } },
});

module.exports = mongoose.model("ResetCode", resetCodeSchema);
