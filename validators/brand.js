const { body, param } = require("express-validator");
const DB = require("../models");
const UserModel = DB.User;

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
    .withMessage("Please provide valid brand name"),
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

module.exports = { createBrand };
