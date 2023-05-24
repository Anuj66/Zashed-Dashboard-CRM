const { error, success } = require("../helper/baseResponse");
const DB = require("../models");
const UserModel = DB.User;
const TicketModel = DB.Ticket;

const createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    let ticketRaised = await TicketModel.create({
      user_id: req.user.id,
      subject,
      message,
      status: "Pending",
    });

    let ticketNumber = "Zashed" + String(ticketRaised.id).padStart(10, "0");
    ticketRaised.set({
      number: ticketNumber,
    });

    ticketRaised = await ticketRaised.save();

    return res.status(201).json(success("CREATED", ticketRaised, 201));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

module.exports = {
  createTicket,
};
