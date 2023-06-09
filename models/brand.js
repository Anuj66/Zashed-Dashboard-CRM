"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Sale, { foreignKey: "brand_id" });
    }
  }
  Brand.init(
    {
      name: { type: DataTypes.STRING, unique: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Brand",
      tableName: "Brands",
      timestamps: true,
    }
  );
  return Brand;
};
