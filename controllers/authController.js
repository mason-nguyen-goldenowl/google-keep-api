const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

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

exports.signup = async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(password, 16);

    const user = await User.create({
      full_name,
      email: email,
      password: encryptedPassword,
    });

    res.status(201).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid email");
      error.statusCode = 401;
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await User.findByIdAndUpdate(
      { _id: user._id },
      { $set: { refresh_token: refreshToken } }
    );
    await res.cookie("access_token", accessToken, {
      maxAge: 3600000,
    });
    await res.cookie("refresh_token", refreshToken, {
      maxAge: 604800000,
      httpOnly: true,
    });
    await res
      .status(200)
      .json({ accessToken, refreshToken, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.refreshUserToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken)
      return res.status(401).json("You are not authenticated!");
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY,
      async (err, user) => {
        err && console.log(err);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        await User.findByIdAndUpdate(
          { _id: user.id },
          { $set: { refresh_token: newRefreshToken } }
        );

        await res.cookie("access_token", newAccessToken, {
          maxAge: 3600000,
        });
        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      }
    );
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
