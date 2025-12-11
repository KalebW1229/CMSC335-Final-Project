// Setting up environment
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config({
   path: path.resolve(__dirname, "credentials/.env"),
});

// Mongoose Schema Setup (do we need to connect to mongodb first?)
const reservationSchema = new mongoose.Schema({
    name: String,
    date: Date,
    guests: Number,
    email: String
})

const Reservation = mongoose.model("Reservation", reservationSchema);

// Endpoints
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (request, response) => {
    response.render("index");
});

app.get("/menu", (request, response) => {
    response.render("menu");
});

app.get("/newReservation", (request, response) => {
    response.render("newReservation");
});

app.post("/processReservation", (request, response) => {
    (async () => {
        try {
            await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

            // Creating new reservation with given parameters
            await Reservation.create({
                name: request.body.name,
                date: request.body.date,
                guests: request.body.guests,
                email: request.body.email
            });

             // Add functionality for showing the reservation that's been added (res.send to template)

        } catch (e) {
            console.log(e)
        } finally {
            await mongoose.disconnect();
        }
    })();
});