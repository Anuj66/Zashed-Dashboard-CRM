const { body, param } = require("express-validator");
const DB = require("../models");
const moment = require("moment/moment");
const UserModel = DB.User;
const BrandModel = DB.Brand;

const createBrand = [
  body("file").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Please upload file!");
    }
    return true;
  }),
  body("name")
    .notEmpty()
    .withMessage("Please enter brand name")
    .isString()
    .withMessage("Please provide valid brand name")
    .custom((value) => {
      return BrandModel.findOne({
        where: {
          name: value,
        },
      }).then((brand) => {
        if (brand) {
          return Promise.reject(
            "Brand with this id already exists, please use update panel!"
          );
        }
        return true;
      });
    }),
  body("user_id")
    .notEmpty()
    .withMessage("Please provide a user id")
    .custom((value) => {
      return UserModel.findOne({
        where: {
          id: value,
        },
      }).then((user) => {
        if (!user) {
          return Promise.reject("User with this id does not exists!");
        }
        return true;
      });
    }),
];

const updateBrandSales = [
  body("brand_id")
    .notEmpty()
    .withMessage("Please provide brand_id value")
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

const brandData = [
  body("brand_ids")
    .optional()
    .isArray()
    .withMessage("Please provide brand ids in an array")
    .custom(async (value) => {
      for (let brandId of value) {
        const brand = await BrandModel.findOne({
          where: {
            id: brandId,
          },
        });
        if (!brand)
          throw new Error("Brand Id: " + brandId + " , does not exists");
      }
      return true;
    }),
  body("start_date")
    .optional()
    .isDate()
    .withMessage("Please enter a valid date"),
  body("end_date")
    .optional()
    .isDate()
    .withMessage("Please enter a valid date")
    .custom((value, { req }) => {
      if (moment(req.body.start_date).isAfter(value)) {
        throw new Error("Please enter end date greater than start date");
      }
      return true;
    }),
];

module.exports = { createBrand, updateBrandSales, brandData };
