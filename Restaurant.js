// Setting up environment
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config({
   path: path.resolve(__dirname, "credentials/.env"),
});

// Endpoints
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (request, response) => {
    response.render("index");
});