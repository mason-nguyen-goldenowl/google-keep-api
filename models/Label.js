import mongoose from "mongoose";
const Schema = mongoose.Schema;

const labelSchema = new Schema(
	{
		labelName: { type: String, required: true },

		creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	},
	{ timestamps: true }
);

export default mongoose.model("Label", labelSchema);
