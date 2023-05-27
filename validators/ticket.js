const { body, param } = require("express-validator");
const DB = require("../models");

const TicketModel = DB.Ticket;

const createTicket = [
  body("subject")
    .notEmpty()
    .withMessage("Please provide a ticket subject")
    .isString()
    .withMessage("Please provide a valid subject"),
  body("message")
    .notEmpty()
    .withMessage("Please provide a ticket message")
    .isString()
    .withMessage("Please provide a valid message"),
];

const updateTicket = [
  body("ticketId")
    .notEmpty()
    .withMessage("Please provide a ticket id")
    .custom((value) => {
      return TicketModel.findOne({
        where: {
          id: value,
        },
      }).then((ticket) => {
        if (!ticket) {
          return Promise.reject("Ticket does not exists!");
        }
        return true;
      });
    }),
  body("feedback")
    .notEmpty()
    .withMessage("Please provide a feedback")
    .isString()
    .withMessage("Please provide a valid feedback"),
];

module.exports = {
  createTicket,
  updateTicket,
};
