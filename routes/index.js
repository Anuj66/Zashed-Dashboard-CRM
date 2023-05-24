const express = require("express");
const UserRoutes = require("./user");
const BrandRoutes = require("./brand");
const SalesRoutes = require("./sale");
const FilterRoutes = require("./filter");
const TicketRoutes = require("./ticket");

const router = new express.Router();

router.use("/user", UserRoutes);
router.use("/brand", BrandRoutes);
router.use("/sales", SalesRoutes);
router.use("/filter", FilterRoutes);
router.use("/ticket", TicketRoutes);

module.exports = router;
