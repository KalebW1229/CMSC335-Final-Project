const express = require("express");
const router = express.Router();

router.get("/menu", (request, response) => {
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

router.get("/viewReservations", async (request, response) => {
  try {
    const Reservation = request.app.locals.Reservation // defined in Restaurant.js
    
    // Getting all reservations
    let reservations = await Reservation.find({});
    console.log(reservations);

    response.render("viewReservations", { reservations });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;