const { body, param } = require("express-validator");
const DB = require("../models");

const UserModel = DB.User;

const createUser = [
  body("username")
    .notEmpty()
    .withMessage("Please enter username")
    .isString()
    .withMessage("Please enter a valid username string")
    .custom((value) => {
      return UserModel.findOne({
        where: {
          username: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("User with this username already exists!");
        }
        return true;
      });
    }),
  body("email")
    .notEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Please enter a valid email string")
    .custom((value) => {
      return UserModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("User with this email already exists!");
        }
        return true;
      });
    }),
  body("password")
    .notEmpty()
    .withMessage("Please enter password")
    .isString()
    .withMessage("Please enter a valid password"),
];

const login = [
  body("username")
    .notEmpty()
    .withMessage("Please enter a username")
    .isString()
    .withMessage("Please enter a valid string")
    .custom((value) => {
      return UserModel.findOne({
        where: {
          username: value,
        },
      }).then((user) => {
        if (!user) {
          return Promise.reject("User does not exists!");
        }
        return true;
      });
    }),
  body("password")
    .notEmpty()
    .withMessage("Please enter a password")
    .isString()
    .withMessage("Please enter a valid password"),
];

const generateOtpForPasswordReset = [
  body("email")
    .notEmpty()
    .withMessage("Please enter an email address")
    .isEmail()
    .withMessage("Please enter a valid email"),
];

module.exports = { createUser, login, generateOtpForPasswordReset };
