const { body, param } = require("express-validator");

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

module.exports = {
  createTicket,
};
