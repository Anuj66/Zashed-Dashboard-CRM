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
router.post(
  "/totalCommission",
  authenticate,
  validate(totalRevenue),
  SalesController.totalCommission
);
router.post(
  "/monthlyRevenue",
  authenticate,
  validate(totalRevenue),
  SalesController.monthyRevenue
);
router.post(
  "/saleQty",
  authenticate,
  validate(totalRevenue),
  SalesController.salesQuantityByBrand
);

module.exports = router;
