const express = require("express");
const router = express.Router();

router.get("/newReservation", (request, response) => {
  response.render("newReservation");
});

router.post("/processReservation", async (request, response) => {
  try {
    const Reservation = request.app.locals.Reservation // defined in Restaurant.js
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

router.get("/cancelReservation", (request, response) => {
  response.render("cancelReservation", { confirm: "" });
});

router.post("/cancelReservation", (request, response) => {
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

module.exports = router;