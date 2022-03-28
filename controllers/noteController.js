import Label from "../models/Label.js";
import Note from "../models/Note.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clearImageAction = (filePath) => {
	filePath = path.join(__dirname, "..", filePath);
	fs.unlink(filePath, (err) => console.log(err));
};

export const getNote = async (req, res, next) => {
	try {
		const notes = await Note.find({ creator: req.userId });
		const sub = req.get("Subcription");
		notes.map((note) => {
			if (note.remind) {
				let now = new Date().getTime();
				let remindTime = new Date(note.remind).getTime();
				let remainingTime = remindTime - now;
				const payload = JSON.stringify({
					title: note.title,
					content: note.content,
				});

				if (remainingTime > 0) {
					setTimeout(() => {
						req.sendNoti.sendNotification(JSON.parse(sub), payload);
					}, remainingTime);
				}
			}
		});

		await res.status(200).json({
			message: "Fetched notes successfully",
			notes,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const searchNote = async (req, res, next) => {
	try {
		const { keyWord } = req.body;

		const regex = new RegExp(keyWord);
		const notes = await Note.find({ title: regex, creator: req.userId });

		await res.status(200).json({
			message: "Fetched notes successfully",
			notes,
		});
	} catch (error) {
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};

export const createNote = async (req, res, next) => {
	try {
		const { title, content, labelId, remind, labelName } = req.body;

		const imageUrl = req.file?.path;
		if (title.length === 0 && content.length === 0) {
			return res.status(400).send("Please check your request");
		}

		if (labelId) {
			let label = await Label.findOne({
				_id: labelId,
			});

			await Note.create({
				title,
				content,
				creator: req.userId,
				labelId: label._id,
				remind,
				imageUrl,
			});
		} else {
			if (labelName) {
				const label = await Label.findOne({ labelName });

				if (!label) {
					const label = await Label.create({
						labelName,
						creator: req.userId,
					});
					await Note.create({
						title,
						content,
						creator: req.userId,
						labelId: label._id,
						remind,
						imageUrl,
					});
				} else {
					await Note.create({
						title,
						content,
						creator: req.userId,
						labelId: label._id,
						remind,
						imageUrl,
					});
				}
			} else {
				await Note.create({
					title,
					content,
					creator: req.userId,
					remind,
					imageUrl,
				});
			}
		}

		const newArrLabel = await Label.find({ creator: req.userId });
		const newArrNote = await Note.find({ creator: req.userId });

		await res.status(201).json({
			message: "Create note successfully!",
			newArrLabel,
			newArrNote,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const editNote = async (req, res, next) => {
	try {
		const { _id, title, content, creator, remind, labelName } = req.body;
		const imageUrl = req.file?.path;

		await Note.findOne({ _id });

		if (creator != req.userId.toString()) {
			const error = new Error("Not authenticated.");
			error.statusCode = 401;
			throw error;
		}

		if (labelName) {
			const label = await Label.findOne({
				labelName,
				creator: req.userId,
			});

			if (label) {
				await Note.findByIdAndUpdate(
					{ _id },
					{
						$set: {
							title,
							content,
							remind,
							labelId: label._id,
							imageUrl,
						},
					},
				);
			} else {
				const newLabel = await Label.create({
					labelName,
					creator: req.userId,
				});
				await Note.findByIdAndUpdate(
					{ _id },
					{
						$set: {
							title,
							content,
							remind,
							labelId: newLabel._id,
							imageUrl,
						},
					},
				);
			}
		} else {
			await Note.findByIdAndUpdate(
				{ _id },
				{
					$set: {
						title,
						content,
						remind,
						imageUrl,
					},
				},
			);
		}
		const newArrLabel = await Label.find({ creator: req.userId });
		const newArrNote = await Note.find({ creator: req.userId });
		await res.status(200).json({
			message: "Note have been edited",
			newArrNote,
			newArrLabel,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const archiveNote = async (req, res, next) => {
	try {
		const { note_id } = req.body;

		const noteArchive = await Note.findOne({ _id: note_id });

		if (noteArchive.archive === true) {
			await Note.findByIdAndUpdate(
				{ _id: note_id },
				{ $set: { archive: false } },
			);
		} else {
			await Note.findByIdAndUpdate(
				{ _id: note_id },
				{ $set: { archive: true } },
			);
		}
		const newArrNote = await Note.find({ creator: req.userId });
		await res
			.status(200)
			.json({ message: "Note have been archived", newArrNote });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const deleteNote = async (req, res, next) => {
	try {
		const { note_id } = req.body;

		await Note.findOneAndUpdate(
			{ _id: note_id },
			{ $set: { deleted: true, deletedAt: Date.now() } },
		);
		const newArrNote = await Note.find({ creator: req.userId });
		await res
			.status(200)
			.json({ message: "Note have been deleted", newArrNote });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const clearRemind = async (req, res, next) => {
	try {
		const { _id, creator } = req.body;

		if (creator != req.userId) {
			const error = new Error("Not authenticated.");
			error.statusCode = 401;
			throw error;
		}

		await Note.findByIdAndUpdate({ _id }, { $unset: { remind: "" } });

		const newArrNote = await Note.find({ creator: req.userId });
		await res
			.status(200)
			.json({ message: "Remind have been deleted", newArrNote });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const clearLabelName = async (req, res, next) => {
	try {
		const { _id, creator } = req.body;

		if (creator != req.userId) {
			const error = new Error("Not authenticated.");
			error.statusCode = 401;
			throw error;
		}

		await Note.findByIdAndUpdate({ _id }, { $unset: { labelId: "" } });

		const newArrNote = await Note.find({ creator: req.userId });
		await res
			.status(200)
			.json({ message: "Remind have been deleted", newArrNote });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const clearImage = async (req, res) => {
	const { _id, creator } = req.body;
	if (creator != req.userId) {
		const error = new Error("Not authenticated.");
		error.statusCode = 401;
		throw error;
	}

	const note = await Note.findOne({ _id });
	if (note.imageUrl) {
		clearImageAction(note.imageUrl);
	}
	await Note.findByIdAndUpdate({ _id }, { $unset: { imageUrl: "" } });
	const newArrNote = await Note.find({ creator: req.userId });
	await res
		.status(200)
		.json({ message: "Image have been deleted", newArrNote });
};

export const removeNote = async (req, res, next) => {
	try {
		const { note_id } = req.body;

		await Note.findOneAndRemove({ _id: note_id });

		const newArrNote = await Note.find({ creator: req.userId });

		await res
			.status(200)
			.json({ message: "Note have been removed", newArrNote });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const restoreNote = async (req, res, next) => {
	try {
		const { note_id } = req.body;

		await Note.findOneAndUpdate(
			{ _id: note_id },
			{ $set: { deleted: false, deletedAt: null } },
		);
		const newArrNote = await Note.find({ creator: req.userId });
		await res
			.status(200)
			.json({ message: "Note have been restored", newArrNote });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const emptyTrash = async (req, res, next) => {
	try {
		const noteTrashId = req.body;
		await Note.deleteMany({ _id: { $in: noteTrashId } });

		const newArrNote = await Note.find({ creator: req.userId });
		await res
			.status(200)
			.json({ message: "Trash have been empty", newArrNote });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
