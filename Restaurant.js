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

// Endpoints
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.render("index");
});

app.get("/menu", (request, response) => {
  let coffee_img = fetch("https://coffee.alexflipnote.dev/random.json")
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    })
    .then((data) => {
      let names = [
        "Itallian",
        "Flat Whites",
        "Chocolate-Infused Mocha",
        "Turkish",
        "Irish",
        "Cortado",
      ];
      let name = names[Math.floor(Math.random() * names.length)];
      response.render("menu", { file: data.file, coffee_name: name });
    })
    .catch((err) => console.log(err.message));
});

app.get("/newReservation", (request, response) => {
  response.render("newReservation");
});

app.post("/processReservation", async (request, response) => {
  try {
    // Creating new reservation with given parameters
    await Reservation.create({
      name: request.body.name,
      date: request.body.date,
      guests: request.body.guests,
      email: request.body.email,
    });

    // Add functionality for showing the reservation that's been added (res.send to template)
    response.render("processReservation", {
      name: request.body.name,
      date: request.body.date,
      guests: request.body.guests,
      email: request.body.email,
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/viewReservations", async (request, response) => {
  try {
    // Getting all reservations
    let reservations = await Reservation.find({});
    console.log(reservations);

    response.render("viewReservations", { reservations });
  } catch (e) {
    console.log(e);
  }
});

app.get("/cancelReservation", (request, response) => {
  response.render("cancelReservation", { confirm: "" });
});

app.post("/cancelReservation", (request, response) => {
  let confirm;
  Reservation.deleteOne({ email: request.body.email })
    .then((result) => {
      if (result.deletedCount < 1) throw new Error("Reservation Not Found");
      confirm = '<h2 id="success">Reservation Canceled</h2>';
    })
    .catch((err) => {
      console.log(err.message);
      confirm = '<h2 id="failure">Reservation Not Found</h2>';
    })
    .finally(() => response.render("cancelReservation", { confirm: confirm }));
});
// Delete later, for testing use only
// Command Line (Portnumber) Interpreter
process.stdin.setEncoding("utf8");
if (process.argv.length != 3) {
  process.stdout.write(`Usage ${process.argv[1]} portNumber\n`);
  process.exit(1);
} else {
  portNumber = process.argv[2];
  app.listen(portNumber);
  console.log(`Web server is running at http://localhost:${portNumber}`);
}
