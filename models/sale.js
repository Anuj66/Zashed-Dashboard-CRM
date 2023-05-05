"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Brand, { foreignKey: "brand_id" });
    }
  }
  Sale.init(
    {
      brand_id: DataTypes.INTEGER,
      portal: DataTypes.STRING,
      status: DataTypes.STRING,
      order_date: DataTypes.DATE,
      main_category: DataTypes.STRING,
      article_type: DataTypes.STRING,
      style: DataTypes.STRING,
      sku: DataTypes.STRING,
      size: DataTypes.STRING,
      week: DataTypes.INTEGER,
      month: DataTypes.INTEGER,
      year: DataTypes.INTEGER,
      mrp: DataTypes.INTEGER,
      discount: DataTypes.INTEGER,
      coupon_discount: DataTypes.INTEGER,
      discount_percentage: DataTypes.INTEGER,
      sale_price: DataTypes.INTEGER,
      sale_qty: DataTypes.INTEGER,
      tax: DataTypes.INTEGER,
      sales_tax: DataTypes.INTEGER,
      zashed_margin: DataTypes.FLOAT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Sale",
      tableName: "Sales",
      timestamps: true,
    }
  );
  return Sale;
};
