const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");

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
  { timestamps: true, expires: "1m" }
);
noteSchema.plugin(mongoose_delete, { deletedAt: true });
module.exports = mongoose.model("Note", noteSchema);
