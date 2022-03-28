import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

import User from "../models/User.js";
import ResetCode from "../models/ResetCode.js";

const generateAccessToken = (user) => {
	return jwt.sign({ _id: user._id }, process.env.ACESS_SECRET_KEY, {
		expiresIn: "1h",
	});
};

const generateRefreshToken = (user) => {
	return jwt.sign({ _id: user._id }, process.env.REFRESH_SECRET_KEY, {
		expiresIn: "7d",
	});
};

export const signup = async (req, res, next) => {
	try {
		const { full_name, email, password } = req.body;

		const oldUser = await User.findOne({ email });

		sgMail.setApiKey(process.env.SENDGRID);

		if (oldUser) {
			return res.status(409).send("User Already Exist. Please Login");
		}

		const encryptedPassword = await bcrypt.hash(password, 16);

		const user = await User.create({
			fullName: full_name,
			email,
			password: encryptedPassword,
		});

		const msg = {
			to: email,
			from: process.env.SENDER,
			subject: "Sending with SendGrid is Fun",
			text: "and easy to do anywhere, even with Node.js",
			html: `<div
      style="
        text-align: center;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        color: black;
      "
    >
      <div style="background-color: #ffff; padding-top: 20px">
        <div style="margin-bottom: 30px">
          <img
            src="https://www.learnersedge.com/hubfs/google%20keep%20image.jpg"
            alt=""
          />
        </div>
        <div>
          <h2>Wellcome to Google Keep</h2>
          <h3>Thanks for subscribing to Google Keep!!</h3>
          <p>As promised, You can note everything in life at Google Keep</p>
          <p>Wish you have a good experience</p>
        </div>
        <div style="background-color: #fdefc3; padding: 20px 0">
          <h4 style="margin: 0">Contact Us:</h4>
          <p>
            <a href="#" style="color: black">google-kepp-clone.io</a>
          </p>
          <p style="margin-top: 30px">
            2022 Google Keep Clone Ltd. All rights reserved
          </p>
        </div>
      </div>
    </div>`,
		};

		sgMail.send(msg);

		res.status(201).json(user);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const login = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			const error = new Error("Invalid email");
			error.statusCode = 409;
			throw error;
		}
		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			const error = new Error("Wrong password");
			error.statusCode = 409;
			throw error;
		}

		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);

		await User.findByIdAndUpdate(
			{ _id: user._id },
			{ $set: { refreshToken } },
		);

		await res.status(200).json({
			accessToken,
			refreshToken,
			userId: user._id.toString(),
			userFname: user.fullName,
			email: user.email,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const refreshUserToken = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken)
			return res.status(401).json("You are not authenticated!");
		jwt.verify(
			refreshToken,
			process.env.REFRESH_SECRET_KEY,
			async (err, user) => {
				err && console.log(err);

				const newAccessToken = generateAccessToken(user);
				const newRefreshToken = generateRefreshToken(user);

				await User.findOneAndUpdate(
					{ _id: user.id },
					{ $set: { refresh_token: newRefreshToken } },
				);

				await res.cookie("access_token", newAccessToken, {
					maxAge: 3600000,
				});
				res.status(200).json({
					accessToken: newAccessToken,
					refreshToken: newRefreshToken,
				});
			},
		);
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const requestResetPassword = async (req, res, next) => {
	try {
		const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		let randomCode = "";

		sgMail.setApiKey(process.env.SENDGRID);

		const charactersLength = characters.length;

		for (let i = 0; i < 8; i++) {
			randomCode += characters.charAt(
				Math.floor(Math.random() * charactersLength),
			);
		}

		const { email } = req.body;
		const user = await User.findOne({ email });
		if (user === undefined) {
			const error = new Error("Invalid email");
			error.statusCode = 409;
			throw error;
		} else if (user.resetPasswordAt === undefined) {
			await ResetCode.findOneAndRemove({ userId: user._id });
		}

		await ResetCode.create({
			resetCode: randomCode,
			userId: user._id,
			resetPassAt: Date.now(),
		});

		await User.findOneAndUpdate(
			{ email },
			{ $set: { resetPasswordAt: Date.now() } },
		);

		const msg = {
			to: email,
			from: process.env.SENDER,
			subject: "Sending with SendGrid is Fun",
			text: "and easy to do anywhere, even with Node.js",
			html: `<div
      style="text-align: center; box-sizing: border-box; margin: 0; padding: 0; color:black"
    >
      <div style="background-color: #ffff; padding-top: 20px">
        <div style="margin-bottom: 30px">
          <img
            src="https://www.learnersedge.com/hubfs/google%20keep%20image.jpg"
            alt=""
          />
        </div>
        <div>
          <h2>Need a quick reset?</h2>
          <h3>Well all do sometimes,and that's okay</h3>
          <p>
            Reset your password by entrering the code below.<br><b>Code is only valid for 20 minutes</b>. If you didn't ask
            for this,<br />
            ignore this email
          </p>
          <div style="margin: 50px 0">
          <span
            style="
              font-size: 24px;
              font-weight: 700;
              border: 1px solid;
              width: 100%;
              padding: 20px 30px;
            "
          >
          ${randomCode}
          </span>
        </div>
        </div>
        <div style="background-color: #fdefc3; padding: 20px 0">
          <h4 style="margin: 0">Contact Us:</h4>
          <p>
            <a href="#" style="color: black">google-kepp-clone.io</a>
          </p>
          <p style="margin-top: 10px">
            2022 Google Keep Clone Ltd. All rights reserved
          </p>
        </div>
      </div>
    </div>`,
		};

		sgMail.send(msg);

		await res.status(200).json({
			message: "Request reset code successfull ",
			resetCode: randomCode,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export const resetPassword = async (req, res, next) => {
	try {
		const { email, reset_code, new_password } = req.body;

		if (!reset_code) {
			return res.status(401).json("Please check your reset code");
		}
		const user = await User.findOne({ email });

		const resetCode = await ResetCode.findOne({ resetCode: reset_code });

		if (resetCode && resetCode.user.toString() === user._id.toString()) {
			const encryptedPassword = await bcrypt.hash(new_password, 16);

			await User.findOneAndUpdate(
				{ email },
				{
					$set: {
						password: encryptedPassword,
						reset_passwordAt: null,
					},
				},
			);
		}
		await ResetCode.findOneAndRemove({ resetCode: reset_code });
		res.status(200).json({
			message: "Reset password successfull ",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
