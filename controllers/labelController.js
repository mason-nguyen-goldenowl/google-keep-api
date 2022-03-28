import Label from "../models/Label.js";
import Note from "../models/Note.js";

export const getLabel = async (req, res, next) => {
	try {
		const labels = await Label.find({ creator: req.userId });
		res.status(200).json({
			message: "Fetched labels successfully",
			labels,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const getLabelName = async (req, res, next) => {
	try {
		const { label_id } = req.body;
		const label = await Label.findOne({ _id: label_id });
		res.status(200).json({ labelName: label.labelName });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const createLabel = async (req, res, next) => {
	try {
		const { label_name } = req.body;
		const label = await Label.findOne({
			labelName: label_name,
			creator: req.userId,
		});

		if (label) {
			return res.status(400).send("Label have already exist");
		}
		await Label.create({
			labelName: label_name,
			creator: req.userId,
		});
		const newArrLabel = await Label.find({ creator: req.userId });
		await res.status(201).json({
			message: "Create label successfully!",
			newArrLabel,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const editLabel = async (req, res, next) => {
	try {
		const { label_id, labelChange } = req.body;

		await Label.findOneAndUpdate(
			{ _id: label_id },
			{ $set: { labelName: labelChange } },
		);

		const newArrLabels = await Label.find({ creator: req.userId });
		const newArrNote = await Note.find({ creator: req.userId });

		await res.status(201).json({
			message: "Edit label successfully!",
			newArrLabels,
			newArrNote,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const deleteLabel = async (req, res, next) => {
	try {
		const { labelId } = req.body;
		await Label.findOneAndRemove({
			_id: labelId,
			creator: req.userId,
		});

		const noteInLabel = await Note.find({
			labelId,
			creator: req.userId,
		});

		noteInLabel.map((note) => {
			note.labelId = null;
			note.save();
		});
		const newArrLabels = await Label.find({ creator: req.userId });
		const newArrNote = await Note.find({ creator: req.userId });
		await res.status(201).json({
			message: "Delete label successfully!",
			newArrLabels,
			newArrNote,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
