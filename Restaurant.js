// Setting up environment
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config({
  path: path.resolve(__dirname, "credentials/.env"),
});

// Mongoose Connection & Schema Setup
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const reservationSchema = new mongoose.Schema({
  name: String,
  date: Date,
  guests: Number,
  email: String,
});

const Reservation = mongoose.model("Reservation", reservationSchema);
app.locals.Reservation = Reservation; // makes Reservation an app wide variable

// Endpoints
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const changesRoute = require("./routes/Changes");
const displaysRoute = require("./routes/Displays");
app.use("/changes", changesRoute);
app.use("/displays", displaysRoute);

app.get("/", (request, response) => {
  response.render("index");
});

app.listen(Number(process.env.PORT) ?? 8080);
