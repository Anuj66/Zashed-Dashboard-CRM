"use strict";
const bcrypt = require("bcrypt");

const DB = require("../models");
const { ADMIN_ROLE_ID } = require("../helper/constants");
const UserModel = DB.User;
const UserRoleModel = DB.UserRole;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = "admin";

    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      username: "admin",
      email: "admin@gmail.com",
      password: securedPassword,
    });

    console.log(user);
    console.log(ADMIN_ROLE_ID);

    await UserRoleModel.create({
      user_id: user.id,
      role_id: ADMIN_ROLE_ID,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
