"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Sales", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      brand_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Brands",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      portal: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      order_date: {
        type: Sequelize.DATE,
      },
      main_category: {
        type: Sequelize.STRING,
      },
      atricle_type: {
        type: Sequelize.STRING,
      },
      style: {
        type: Sequelize.STRING,
      },
      sku: {
        type: Sequelize.STRING,
      },
      size: {
        type: Sequelize.STRING,
      },
      week: {
        type: Sequelize.INTEGER,
      },
      month: {
        type: Sequelize.INTEGER,
      },
      year: {
        type: Sequelize.INTEGER,
      },
      mrp: {
        type: Sequelize.INTEGER,
      },
      discount: {
        type: Sequelize.INTEGER,
      },
      coupon_discount: {
        type: Sequelize.INTEGER,
      },
      discount_percentage: {
        type: Sequelize.INTEGER,
      },
      sale_price: {
        type: Sequelize.INTEGER,
      },
      sale_qty: {
        type: Sequelize.INTEGER,
      },
      tax: {
        type: Sequelize.INTEGER,
      },
      sales_tax: {
        type: Sequelize.INTEGER,
      },
      zashed_margin: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Sales");
  },
};
