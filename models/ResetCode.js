import mongoose from "mongoose";
const Schema = mongoose.Schema;

const resetCodeSchema = new Schema({
	resetCode: { type: String, required: true },
	userId: { type: Schema.Types.ObjectId, required: true },
	resetPassAt: { type: Date, index: { expires: "20m" } },
});

export default mongoose.model("ResetCode", resetCodeSchema);
