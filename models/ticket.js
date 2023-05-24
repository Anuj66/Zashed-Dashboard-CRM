"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "user_id" })
    }
  }
  Ticket.init(
    {
      number: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      subject: DataTypes.STRING,
      message: DataTypes.STRING,
      status: DataTypes.ENUM("Resolved", "Pending"),
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Ticket",
      tableName: "Tickets",
      timestamps: true
    }
  );
  return Ticket;
};
