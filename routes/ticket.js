const express = require("express");
const TicketController = require("../controller/ticket");
const authenticate = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { createTicket } = require("../validators/ticket");

const router = new express.Router();

router.post(
  "/createTicket",
  authenticate,
  validate(createTicket),
  TicketController.createTicket
);

router.get("/getTickets", authenticate, TicketController.listTickets);

module.exports = router;
