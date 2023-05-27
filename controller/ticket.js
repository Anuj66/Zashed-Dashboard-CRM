const { error, success } = require("../helper/baseResponse");
const { ADMIN_ROLE_ID } = require("../helper/constants");
const { userHasRole } = require("../helper/userHasRole");
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

const listTickets = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    const filter = {};
    if (!isAdmin) {
      filter.user_id = req.user.id;
    }
    const tickets = await TicketModel.findAll({
      where: filter,
      include: {
        model: UserModel,
        attributes: ["username", "email"],
      },
    });
    return res.status(200).json(success("OK", tickets, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const updateTicket = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    if (!isAdmin) {
      return res.status(403).json(error("Unauthorized access", 403));
    }

    const { ticketId, feedback } = req.body;
    let ticket = await TicketModel.findOne({
      where: {
        id: ticketId,
      },
    });

    ticket.set({
      status: "Resolved",
      feedback,
    });

    ticket = await ticket.save();
    return res.status(201).json(success("UPDATED", ticket, 201));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

module.exports = {
  createTicket,
  listTickets,
  updateTicket,
};
