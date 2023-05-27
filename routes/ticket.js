const express = require("express");
const TicketController = require("../controller/ticket");
const authenticate = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { createTicket, updateTicket } = require("../validators/ticket");

const router = new express.Router();

router.post(
  "/createTicket",
  authenticate,
  validate(createTicket),
  TicketController.createTicket
);

router.get("/getTickets", authenticate, TicketController.listTickets);

router.put(
  "/updateTicket",
  authenticate,
  validate(updateTicket),
  TicketController.updateTicket
);

module.exports = router;
