const { Sequelize, Op } = require("sequelize");
const { error, success } = require("../helper/baseResponse");
const { ADMIN_ROLE_ID } = require("../helper/constants");
const { userHasRole } = require("../helper/userHasRole");
const DB = require("../models");
const SalesModel = DB.Sale;
const BrandModel = DB.Brand;

const totalRevenue = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    if (!isAdmin) {
      return res.status(403).json(error("User not authorized", 403));
    }

    const { brand_id, year } = req.body;

    let filter = {};
    if (year != null && year != "") {
      filter.year = year;
    }
    if (brand_id != null && brand_id != "") {
      filter.brand_id = brand_id;
    }

    filter.status = "Sales";
    const totalSalesByBrand = await SalesModel.findAll({
      where: filter,
      attributes: [
        "brand_id",
        [Sequelize.literal("SUM(sale_price * sale_qty)"), "result"],
      ],
      group: ["brand_id"],
      include: [
        {
          model: BrandModel,
          attributes: ["name"],
        },
      ],
    });

    filter.status = {
      [Op.or]: ["Return", "RTO"],
    };
    const totalReturnByBrand = await SalesModel.findAll({
      where: filter,
      group: ["brand_id"],
      attributes: [
        "brand_id",
        [Sequelize.literal("SUM(sale_price * sale_qty)"), "result"],
      ],
      include: {
        model: BrandModel,
        attributes: ["name"],
      },
    });

    let totalRevenue = 0;
    let brandDetails = [];
    for (let salesData of totalSalesByBrand) {
      let data = {};
      let salesResult = 0;
      Object.keys(salesData.dataValues).forEach(function (key) {
        if (key == "result") salesResult = salesData.dataValues[key];
      });
      for (let returnData of totalReturnByBrand) {
        if (salesData.brand_id === returnData.brand_id) {
          let returnResult = 0;
          Object.keys(salesData.dataValues).forEach(function (key) {
            if (key == "result") returnResult = returnData.dataValues[key];
          });
          data.totalSales = parseInt(salesResult);
          data.totalReturn = parseInt(returnResult);
          data.totalRevenue = data.totalSales - data.totalReturn;
          data.brand = salesData.Brand;
        }
      }
      totalRevenue += data.totalRevenue;
      brandDetails.push(data);
    }

    return res
      .status(200)
      .json(success("OK", { brandDetails, totalRevenue }, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

module.exports = {
  totalRevenue,
};
