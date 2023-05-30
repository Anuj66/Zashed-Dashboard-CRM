const { body, param } = require("express-validator");
const DB = require("../models");

const TicketModel = DB.Ticket;
const UserModel = DB.User;

const createTicket = [
  body("subject")
    .optional()
    .isString()
    .withMessage("Please provide a valid subject"),
  body("message")
    .optional()
    .isString()
    .withMessage("Please provide a valid message"),
  body("adminMessage")
    .optional()
    .isString()
    .withMessage("Please provide a valid message"),
  body("userId")
    .optional()
    .custom((value) => {
      return UserModel.findOne({
        where: {
          id: value,
        },
      }).then((user) => {
        if (!user) {
          return Promise.reject("User does not exists!");
        }
        return true;
      });
    }),
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
    .optional()
    .isString()
    .withMessage("Please provide a valid feedback"),
  body("message")
    .optional()
    .isString()
    .withMessage("Please provide a valid message"),
];

module.exports = {
  createTicket,
  updateTicket,
};
