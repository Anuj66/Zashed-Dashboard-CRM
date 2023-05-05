const express = require("express");
const UserRoutes = require("./user");
const BrandRoutes = require("./brand");

const router = new express.Router();

router.use("/user", UserRoutes);
router.use("/brand", BrandRoutes);

module.exports = router;
