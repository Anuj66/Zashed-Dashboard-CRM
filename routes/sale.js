const express = require("express");
const SalesController = require("../controller/sales");
const authenticate = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { totalRevenue } = require("../validators/sales");

const router = new express.Router();

router.post(
  "/totalRevenue",
  authenticate,
  validate(totalRevenue),
  SalesController.totalRevenue
);

module.exports = router;
