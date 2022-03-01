const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: new Date(),
  },
  refresh_token: { type: String },
  note: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
