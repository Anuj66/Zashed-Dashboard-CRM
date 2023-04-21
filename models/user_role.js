"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.belongsTo(models.Role, { foreignKey: "role_id" });
    }
  }
  User_Role.init(
    {
      userId: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserRole",
      tableName: "UserRoles",
      timestamps: true,
    }
  );
  return User_Role;
};
