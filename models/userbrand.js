"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserBrand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.belongsTo(models.Brand, { foreignKey: "brand_id" });
    }
  }
  UserBrand.init(
    {
      user_id: DataTypes.INTEGER,
      brand_id: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserBrand",
      tableName: "UserBrands",
      timestamps: true,
    }
  );
  return UserBrand;
};
