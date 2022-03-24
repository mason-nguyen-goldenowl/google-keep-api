const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/note");
const labelRoutes = require("./routes/label");

const app = express();

dotenv.config();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cookieParser());

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/auth", authRoutes);
app.use("/note", noteRoutes);
app.use("/label", labelRoutes);
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});
app.get("/", (req, res) => res.send("Hello World!"));
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("DB conected");
});

const port = process.env.PORT || 3838;

app.listen(port, () => {
  console.log("Sever Running at ", port);
});
