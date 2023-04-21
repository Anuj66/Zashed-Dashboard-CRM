const express = require("express");
const helloWorldRoutes = require("./helloWorld");

const router = new express.Router();

router.use("/helloWorld", helloWorldRoutes);

module.exports = router;
