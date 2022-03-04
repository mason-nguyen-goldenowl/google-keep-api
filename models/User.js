const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
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
    refresh_token: { type: String },
    note: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    reset_code: { type: String },
    reset_passwordAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
