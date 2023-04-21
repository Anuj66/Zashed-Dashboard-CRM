const express = require("express");
const UserRoutes = require("./user");

const router = new express.Router();

router.use("/user", UserRoutes);

module.exports = router;
