const { Sequelize } = require("sequelize");
const { error, success } = require("../helper/baseResponse");
const DB = require("../models");
const SalesModel = DB.Sale;

const yearFilter = async (req, res) => {
  try {
    const results = await SalesModel.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("year")), "year"]],
    });

    const response = [];
    for (let data of results) {
      response.push(data.year);
    }

    return res.status(200).json(success("OK", response, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

module.exports = { yearFilter };
