const { Sequelize, Op } = require("sequelize");
const { error, success } = require("../helper/baseResponse");
const { ADMIN_ROLE_ID } = require("../helper/constants");
const { userHasRole } = require("../helper/userHasRole");
const DB = require("../models");
const SalesModel = DB.Sale;
const BrandModel = DB.Brand;
const UserBrandModel = DB.UserBrand;

const totalRevenue = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    let userBrandDetails = [];
    if (!isAdmin) {
      userBrandDetails = await UserBrandModel.findAll({
        where: {
          user_id: req.user.id,
        },
      });
    }

    const { brand_id, year, month } = req.body;

    let filter = {};
    let brandFilter = {};
    if (year != null && year != "") {
      filter.year = year;
    }
    if (brand_id != null && brand_id != "" && isAdmin) {
      filter.brand_id = {
        [Op.in]: brand_id,
      };
      brandFilter.id = {
        [Op.in]: brand_id,
      };
    } else {
      const brandIds = [];
      for (let data of userBrandDetails) {
        brandIds.push(data.brand_id);
      }
      filter.brand_id = {
        [Op.in]: brandIds,
      };
      brandFilter.id = {
        [Op.in]: brandIds,
      };
    }
    if (month != null && month != "") {
      filter.month = month;
    }

    const brandList = await BrandModel.findAll({ where: brandFilter });
    let brandDetails = [];
    for (let brand of brandList) {
      brandDetails.push({
        brand_id: brand.id,
        brand_name: brand.name,
        totalSales: 0,
        totalReturn: 0,
        totalRevenue: 0,
        revenueComposition: 0,
      });
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
          attributes: ["name", "id"],
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
        attributes: ["name", "id"],
      },
    });

    let totalSales = 0;
    let totalReturn = 0;
    let totalRevenue = 0;
    for (let brand of brandDetails) {
      for (let salesBrand of totalSalesByBrand) {
        let salesResult = 0;
        Object.keys(salesBrand.dataValues).forEach(function (key) {
          if (key === "result") salesResult = salesBrand.dataValues[key];
        });
        if (salesBrand.brand_id == brand.brand_id)
          brand.totalSales = parseInt(salesResult);
      }

      for (let returnBrand of totalReturnByBrand) {
        let returnResult = 0;
        Object.keys(returnBrand.dataValues).forEach(function (key) {
          if (key === "result") returnResult = returnBrand.dataValues[key];
        });
        if (returnBrand.brand_id == brand.brand_id)
          brand.totalReturn = parseInt(returnResult);
      }

      totalSales += brand.totalSales;
      totalReturn += brand.totalReturn;
      brand.totalRevenue = brand.totalSales - brand.totalReturn;
    }

    totalRevenue = totalSales - totalReturn;

    for (let brand of brandDetails) {
      brand.revenueComposition = parseFloat(
        (brand.totalRevenue * 100) / totalRevenue
      ).toFixed(2);
    }

    let result = {
      brandDetails,
      totalSales,
      totalReturn,
      totalRevenue,
    };

    return res.status(200).json(success("OK", result, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const totalCommission = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    if (!isAdmin) {
      return res.status(403).json(error("User not authorized", 403));
    }

    const { brand_id, year } = req.body;

    let filter = {};
    let brandFilter = {};
    if (year != null && year != "") {
      filter.year = year;
    }
    if (brand_id != null && brand_id != "") {
      filter.brand_id = brand_id;
      brandFilter.id = brand_id;
    }

    const brandList = await BrandModel.findAll({ where: brandFilter });
    const brandDetails = [];
    for (let brand of brandList) {
      brandDetails.push({
        brand_id: brand.id,
        brand_name: brand.name,
        totalCommission: 0,
        commissionComposition: 0,
      });
    }

    filter.status = "Sales";
    const totalCommissionByBrands = await SalesModel.findAll({
      where: filter,
      attributes: [
        [Sequelize.literal("SUM(zashed_margin)"), "totalCommission"],
      ],
      group: ["brand_id"],
      include: {
        model: BrandModel,
        attributes: ["name", "id"],
      },
    });

    let totalCommission = 0;
    for (let brand of brandDetails) {
      for (let data of totalCommissionByBrands) {
        let commissionDetails = 0;
        Object.keys(data.dataValues).forEach(function (key) {
          console.log(key, data.dataValues[key]);
          if (key === "totalCommission")
            commissionDetails = data.dataValues[key];
        });
        if (data.Brand.id === brand.brand_id) {
          brand.totalCommission = parseInt(commissionDetails);
          totalCommission += parseInt(commissionDetails);
        }
      }
    }

    if (totalCommission != 0)
      for (let brand of brandDetails) {
        brand.commissionComposition = parseFloat(
          (brand.totalCommission * 100) / totalCommission
        ).toFixed(2);
      }

    let result = {
      brandDetails,
      totalCommission,
    };

    return res.status(200).json(success("OK", result, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const monthyRevenue = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    let userBrandDetails = [];
    let brandIds = [];

    if (!isAdmin) {
      userBrandDetails = await UserBrandModel.findAll({
        where: {
          user_id: req.user.id,
        },
      });
      for (let data of userBrandDetails) {
        brandIds.push(data.brand_id);
      }
    }

    const { year } = req.body;

    let filter = {
      year: new Date().getFullYear(),
    };

    if (year != null && year != "") {
      filter.year = year;
    }
    if (!isAdmin) {
      filter.brand_id = {
        [Op.in]: brandIds,
      };
    }

    const monthlyRevenueSalesData = await SalesModel.findAll({
      where: filter,
      attributes: ["month", "brand_id", "sale_price", "sale_qty", "status"],
      include: {
        model: BrandModel,
        attributes: ["name"],
      },
    });

    const arr = [];
    for (let data of monthlyRevenueSalesData)
      arr.push({
        month: data.month,
        brand_id: data.brand_id,
        brand_name: data.Brand.name,
        sale_price: data.sale_price,
        sale_qty: data.sale_qty,
        status: data.status,
      });

    const monthlyRevenueSalesDataByBrand = groupBy(arr, "brand_name");

    const result = {};
    Object.keys(monthlyRevenueSalesDataByBrand).forEach(function (key) {
      const monthlyData = groupBy(monthlyRevenueSalesDataByBrand[key], "month");
      let resMonthlyData = {};
      for (let i = 1; i <= 12; i++)
        resMonthlyData[i] = {
          totalSales: 0,
          totalReturn: 0,
          totalRevenue: 0,
        };
      Object.keys(monthlyData).forEach(function (key) {
        let salesData = 0;
        let returnData = 0;
        for (let data of monthlyData[key]) {
          if (data.status == "Sales")
            salesData += data.sale_price * data.sale_qty;
          else returnData += data.sale_price * data.sale_qty;
        }
        const revenue = salesData - returnData;
        resMonthlyData[key] = {
          totalSales: salesData,
          totalReturn: returnData,
          totalRevenue: revenue,
        };
      });

      result[key] = resMonthlyData;
    });

    const brandFilter = {};
    if (!isAdmin) {
      brandFilter.id = {
        [Op.in]: brandIds,
      };
    }
    const brandList = await BrandModel.findAll({ where: brandFilter });
    const brandListObj = {};
    for (let brand of brandList) {
      const monthListObj = {};
      for (let i = 1; i <= 12; i++)
        monthListObj[i] = {
          totalSales: 0,
          totalReturn: 0,
          totalRevenue: 0,
        };
      brandListObj[brand.name] = monthListObj;
    }

    Object.keys(result).forEach(function (key) {
      const brandName = key;
      const monthListObj = result[key];
      Object.keys(monthListObj).forEach(function (key) {
        brandListObj[brandName][key] = monthListObj[key];
      });
    });

    return res.status(200).json(success("OK", brandListObj, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const salesQuantityByBrand = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    let userBrandDetails = [];
    if (!isAdmin) {
      userBrandDetails = await UserBrandModel.findAll({
        where: {
          user_id: req.user.id,
        },
      });
    }

    const filter = {};
    const brandFilter = {};
    const { year, month, brand_id } = req.body;

    if (year != null && year != "") filter.year = year;
    if (month != null && month != "") filter.month = month;
    if (brand_id != null && brand_id != "" && isAdmin) {
      filter.brand_id = {
        [Op.in]: brand_id,
      };
      brandFilter.id = {
        [Op.in]: brand_id,
      };
    } else {
      const brandIds = [];
      for (let data of userBrandDetails) brandIds.push(data.brand_id);
      filter.brand_id = {
        [Op.in]: brandIds,
      };
      brandFilter.id = {
        [Op.in]: brandIds,
      };
    }

    const brandList = await BrandModel.findAll({ where: brandFilter });
    const brandDetails = [];
    for (let brand of brandList) {
      brandDetails.push({
        brand_id: brand.id,
        brand_name: brand.name,
        totalSaleQuantity: 0,
      });
    }

    const salesQuantityData = await SalesModel.findAll({
      where: filter,
      attributes: ["brand_id", [Sequelize.literal("SUM(sale_qty)"), "saleQty"]],
      group: ["brand_id"],
      include: {
        model: BrandModel,
        attributes: ["name"],
      },
    });

    totalSaleQty = 0;
    for (let brand of brandDetails) {
      for (let data of salesQuantityData) {
        if (brand.brand_id === data.brand_id) {
          let returnResult = 0;
          Object.keys(data.dataValues).forEach(function (key) {
            if (key === "saleQty") returnResult = data.dataValues[key];
          });
          brand.totalSaleQuantity = parseInt(returnResult);
          totalSaleQty += parseInt(returnResult);
        }
      }
    }

    let result = {
      brandDetails,
      totalSaleQty,
    };

    return res.status(200).json(success("OK", result, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

module.exports = {
  totalRevenue,
  totalCommission,
  monthyRevenue,
  salesQuantityByBrand,
};
