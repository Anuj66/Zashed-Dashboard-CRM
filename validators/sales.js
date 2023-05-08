const { body, param } = require("express-validator");
const DB = require("../models");
const { Op } = require("sequelize");
const BrandModel = DB.Brand;

const totalRevenue = [
  body("year").optional(),
  body("month").optional(),
  body("brand_ids")
    .optional()
    .isArray()
    .withMessage("Please provide an array of brand ids"),
];

module.exports = {
  totalRevenue,
};
