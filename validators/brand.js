const { body, param } = require("express-validator");
const DB = require("../models");
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

module.exports = { createBrand, updateBrandSales };
