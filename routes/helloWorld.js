const express = require("express");
const helloWorldController = require("../controller/helloWorld");

const router = express.Router();

router.get("/", helloWorldController.hello);

module.exports = router;
