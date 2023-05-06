const express = require("express");
const FilterController = require("../controller/filter");
const authenticate = require("../middleware/auth");

const router = new express.Router();

router.get("/years", authenticate, FilterController.yearFilter);

module.exports = router;
