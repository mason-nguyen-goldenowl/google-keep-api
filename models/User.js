import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		fullName: {
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
		refreshToken: { type: String },

		resetPasswordAt: { type: Date },
	},
	{ timestamps: true }
);

export default mongoose.model("User", userSchema);
