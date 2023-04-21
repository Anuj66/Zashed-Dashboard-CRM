const express = require("express");
const authenticate = require("../middleware/auth");
const UserController = require("../controller/user");
const { validate } = require("../middleware/validate");
const { createUser, login } = require("../validators/user");

const router = new express.Router();

router.post(
  "/createUser",
  authenticate,
  validate(createUser),
  UserController.createUser
);

router.post("/login", validate(login), UserController.login);

module.exports = router;
