import mongoose from "mongoose";
const Schema = mongoose.Schema;

const noteSchema = new Schema(
	{
		title: {
			type: String,
			default: "",
		},
		content: {
			type: String,
			default: "",
		},
		creator: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		remind: {
			type: Date,
		},
		imageUrl: {
			type: String,
		},
		labelId: {
			type: Schema.Types.ObjectId,
		},
		archive: {
			type: Boolean,
		},
		deleted: {
			type: Boolean,
		},
		deletedAt: {
			type: Date,
			index: { expires: "7d" },
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Note", noteSchema);
