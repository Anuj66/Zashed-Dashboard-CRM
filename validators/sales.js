const { body, param } = require("express-validator");
const DB = require("../models");
const BrandModel = DB.Brand;

const totalRevenue = [
  body("year").optional(),
  body("month").optional(),
  body("brand_id")
    .optional()
    .custom((value) => {
      return BrandModel.findOne({
        where: {
          id: value,
        },
      }).then((brand) => {
        if (!brand) {
          return Promise.reject("Brand with this id does not exists!");
        }
        return true;
      });
    }),
];

module.exports = {
  totalRevenue,
};
