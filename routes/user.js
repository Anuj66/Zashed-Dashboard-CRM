const express = require("express");
const authenticate = require("../middleware/auth");
const UserController = require("../controller/user");
const { validate } = require("../middleware/validate");
const {
  createUser,
  login,
  generateOtpForPasswordReset,
  resetPassword,
  acceptTermsAndCondition,
} = require("../validators/user");

const router = new express.Router();

router.post(
  "/createUser",
  authenticate,
  validate(createUser),
  UserController.createUser
);
router.post("/login", validate(login), UserController.login);
router.post(
  "/generateOtp",
  validate(generateOtpForPasswordReset),
  UserController.generateOtpForPasswordReset
);
router.post(
  "/resetPassword",
  validate(resetPassword),
  UserController.resetPassword
);
router.get("/getClients", authenticate, UserController.listUser);
router.put(
  "/acceptTNC",
  authenticate,
  validate(acceptTermsAndCondition),
  UserController.acceptTermsAndCondition
);

module.exports = router;
