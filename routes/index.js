const express = require("express");
const UserRoutes = require("./user");
const BrandRoutes = require("./brand");
const SalesRoutes = require("./sale");

const router = new express.Router();

router.use("/user", UserRoutes);
router.use("/brand", BrandRoutes);
router.use("/sales", SalesRoutes);

module.exports = router;
