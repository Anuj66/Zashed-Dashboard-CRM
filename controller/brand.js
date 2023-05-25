const { Op } = require("sequelize");
const { error, success } = require("../helper/baseResponse");
const {
  ADMIN_ROLE_ID,
  UPLOAD_BASE_PATH,
  getMonthName,
} = require("../helper/constants");
const { readExcelFile } = require("../helper/readFile");
const { userHasRole } = require("../helper/userHasRole");
const DB = require("../models");
const { totalRevenue } = require("./sales");
const { groupBy } = require("../helper/commonMethod");

const BrandModel = DB.Brand;
const UserBrandModel = DB.UserBrand;
const SalesModel = DB.Sale;

const createBrand = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    if (!isAdmin) {
      return res.status(403).json(error("You are not authorized", 403));
    }

    const { name, user_id } = req.body;

    const newBrand = await BrandModel.create({
      name,
    });

    await UserBrandModel.create({
      user_id,
      brand_id: newBrand.id,
    });

    const savedSalesData = await pushExcelDataToDb(req.file, newBrand.id);

    const response = {
      brand: newBrand,
      savedSalesData,
    };

    return res.status(200).json(success("CREATED", response, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const updateBrandSales = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    if (!isAdmin) {
      return res.status(403).json(error("User not authorized", 403));
    }

    const { brand_id } = req.body;
    const deletedSales = await SalesModel.destroy({
      where: {
        brand_id,
      },
    });
    console.log(deletedSales);

    const savedSalesData = await pushExcelDataToDb(req.file, brand_id);

    return res.status(201).json(success("UPDATED", savedSalesData, 201));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const listBrands = async (req, res) => {
  try {
    const brandDetails = await BrandModel.findAll();
    return res.status(200).json(success("OK", brandDetails, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const pushExcelDataToDb = async (file, brand_id) => {
  const result = readExcelFile(file);
  const data = result["Data"];
  data.shift();

  const output = jsonToDbData(data, brand_id);
  return await SalesModel.bulkCreate(output);
};

const jsonToDbData = (data, brand_id) => {
  const result = [];
  for (let row of data) {
    let isDataValid = true;
    let temp = {
      brand_id,
    };
    Object.keys(row).forEach(function (key) {
      let val = row[key];
      if (val === "#VALUE!") {
        isDataValid = false;
      }
      if (isDataValid) {
        const out = getSalesData(key, val);
        temp[out.key] = out.value;
      }
    });
    if (isDataValid) result.push(temp);
  }
  return result;
};

const getSalesData = (key, val) => {
  if (key == "A") {
    return { key: "status", value: val };
  }
  if (key == "B") {
    return { key: "portal", value: val };
  }
  if (key == "C") {
    return { key: "order_date", value: val };
  }
  if (key == "D") {
    return { key: "main_category", value: val };
  }
  if (key == "E") {
    return { key: "article_type", value: val };
  }
  if (key == "F") {
    return { key: "style", value: val };
  }
  if (key == "G") {
    return { key: "sku", value: val };
  }
  if (key == "H") {
    return { key: "size", value: val };
  }
  if (key == "I") {
    return { key: "week", value: parseInt(val) };
  }
  if (key == "J") {
    return { key: "month", value: parseInt(val) };
  }
  if (key == "K") {
    return { key: "year", value: parseInt(val) };
  }
  if (key == "L") {
    return { key: "mrp", value: parseInt(val) };
  }
  if (key == "M") {
    return { key: "discount", value: parseInt(val) };
  }
  if (key == "N") {
    return { key: "coupon_discount", value: parseInt(val) };
  }
  if (key == "O") {
    return {
      key: "discount_percentage",
      value: Math.round(parseFloat(val) * 100),
    };
  }
  if (key == "P") {
    return { key: "sale_price", value: parseInt(val) };
  }
  if (key == "Q") {
    return { key: "sale_qty", value: parseInt(val) };
  }
  if (key == "R") {
    return { key: "tax", value: parseFloat(val).toFixed(2) };
  }
  if (key == "S") {
    return { key: "sales_tax", value: parseFloat(val).toFixed(2) };
  }
  if (key == "T") {
    return { key: "zashed_margin", value: parseFloat(val).toFixed(2) };
  }
};

const brandData = async (req, res) => {
  try {
    const isAdmin = await userHasRole(req.user.id, ADMIN_ROLE_ID);
    const { brand_ids, start_date, end_date } = req.body;
    let brandFilter = {};
    if (brand_ids != null && brand_ids.length > 0) {
      brandFilter.brand_id = {
        [Op.in]: brand_ids,
      };
    }

    let userBrands = {};
    let brandList = [];
    if (isAdmin) {
      userBrands = await UserBrandModel.findAll({
        where: brandFilter,
        include: {
          model: BrandModel,
        },
      });
    } else {
      brandFilter.user_id = req.user.id;
      userBrands = await UserBrandModel.findAll({
        where: brandFilter,
        include: {
          model: BrandModel,
        },
      });
    }

    for (let data of userBrands) {
      brandList.push(data.brand_id);
    }
    if (brand_ids != null && brand_ids > 0 && !isAdmin) {
      for (let brandId of brand_ids) {
        if (!brandList.includes(brandId)) {
          return res
            .status(404)
            .json(error("User not authorized to access others brands"));
        }
      }
    }

    const filter = {};

    if (start_date != null && start_date != "") {
      filter.order_date = {
        [Op.gte]: new Date(start_date),
      };
    }
    if (end_date != null && end_date != "") {
      filter.order_date = {
        [Op.lte]: new Date(end_date),
      };
    }
    if (
      start_date != null &&
      start_date != "" &&
      end_date != null &&
      end_date != ""
    ) {
      filter.order_date = {
        [Op.gte]: new Date(start_date),
        [Op.lte]: new Date(end_date),
      };
    }

    const salesData = await SalesModel.findAll({
      where: filter,
    });

    let brandData = [];
    let totalSales = 0;
    let totalReturn = 0;
    let totalQty = 0;
    let totalCommission = 0;
    for (let brand of userBrands) {
      let totalBrandSales = 0;
      let totalBrandReturn = 0;
      let totalBrandSalesQty = 0;
      let totalBrandReturnQty = 0;
      let totalBrandCommission = 0;
      let brandAOV = 0;
      let returnPercentage = 0;
      let brandSaleData = [];
      let highestDiscountRangeData = {
        ">70": 0,
        ">60 & <=70": 0,
        ">50 & <=60": 0,
        ">35 & <=50": 0,
        ">20 & <=35": 0,
        "<=20": 0,
      };
      let ASP = {
        ">1000": 0,
        ">800 & <=1000": 0,
        ">600 & <=800": 0,
        ">400 & <=600": 0,
        "<=400": 0,
      };
      for (let sale of salesData) {
        if (brand.brand_id === sale.brand_id) {
          if (sale.status === "Sales") {
            totalBrandSales += sale.sale_price * sale.sale_qty;
            totalBrandSalesQty += sale.sale_qty;
            totalBrandCommission += sale.zashed_margin;
          }

          if (sale.status === "Return" || sale.status === "RTO") {
            totalBrandReturn += sale.sale_price * sale.sale_qty;
            totalBrandReturnQty += sale.sale_qty;
          }
          brandSaleData.push(sale);

          if (sale.discount_percentage > 70)
            highestDiscountRangeData[">70"] += 1;
          if (sale.discount_percentage > 60 && sale.discount_percentage <= 70)
            highestDiscountRangeData[">60 & <=70"] += 1;
          if (sale.discount_percentage > 50 && sale.discount_percentage <= 60)
            highestDiscountRangeData[">50 & <=60"] += 1;
          if (sale.discount_percentage > 35 && sale.discount_percentage <= 50)
            highestDiscountRangeData[">35 & <=50"] += 1;
          if (sale.discount_percentage > 20 && sale.discount_percentage <= 35)
            highestDiscountRangeData[">20 & <=35"] += 1;
          if (sale.discount_percentage <= 20)
            highestDiscountRangeData["<=20"] += 1;

          if (sale.sale_price > 1000) ASP[">1000"] += 1;
          if (sale.sale_price > 800 && sale.sale_price <= 1000)
            ASP[">800 & <=1000"] += 1;
          if (sale.sale_price > 600 && sale.sale_price <= 800)
            ASP[">600 & <=800"] += 1;
          if (sale.sale_price > 400 && sale.sale_price <= 600)
            ASP[">400 & <=600"] += 1;
          if (sale.sale_price <= 400) ASP["<=400"] += 1;
        }
      }
      if (totalBrandSalesQty != 0) {
        brandAOV = parseFloat(totalBrandSales / totalBrandSalesQty).toFixed(2);
        returnPercentage = parseFloat(
          Math.abs(totalBrandReturnQty) / totalBrandSalesQty
        ).toFixed(2);
      }
      totalSales += totalBrandSales;
      totalReturn += totalBrandReturn;
      totalQty += totalBrandSalesQty + totalBrandReturnQty;
      totalCommission += totalBrandCommission;
      let bd = {
        brand_id: brand.brand_id,
        brand_name: brand.Brand.name,
        totalBrandSales,
        totalBrandSalesQty,
        totalBrandReturn,
        totalBrandReturnQty: Math.abs(totalBrandReturnQty),
        brandAOV,
        returnPercentage,
        highestDiscountRangeData,
        ASP,
        totalBrandRevenue:
          parseInt(totalBrandSales) - parseInt(totalBrandReturn),
        brandSaleData,
      };
      if (isAdmin)
        bd.totalBrandCommission = parseFloat(totalBrandCommission).toFixed(2);
      brandData.push(bd);
    }
    let totalRevenue = totalSales - totalReturn;

    for (let data of brandData) {
      if (totalRevenue != 0) {
        data.brandRevenueComposition = parseFloat(
          (parseInt(data.totalBrandRevenue) * 100) / totalRevenue
        ).toFixed(2);
      } else {
        data.brandRevenueComposition = 0;
      }

      if (totalCommission != 0 && isAdmin) {
        data.brandCommissionComposition = parseFloat(
          (parseInt(data.totalBrandCommission) * 100) / totalCommission
        ).toFixed(2);
      }

      data.portalWiseData = salesReturnDataAsPerField(
        data.brandSaleData,
        "portal"
      );

      data.articleWiseData = salesReturnDataAsPerField(
        data.brandSaleData,
        "article_type"
      );

      data.mainCategoryWiseData = salesReturnDataAsPerField(
        data.brandSaleData,
        "main_category"
      );

      let yearlyRevenueKeyValueData = groupBy(data.brandSaleData, "year");
      let yearlyRevenueData = [];
      Object.keys(yearlyRevenueKeyValueData).forEach(function (key) {
        let totalYearlySales = 0;
        let totalYearlyReturn = 0;
        let totalYearlySalesQty = 0;
        let totalYearlyReturnQty = 0;
        let monthlyRevenueKeyValueData = groupBy(
          yearlyRevenueKeyValueData[key],
          "month"
        );
        let monthlyRevenueData = [];
        for (let i = 1; i <= 12; i++) {
          monthlyRevenueData.push({
            month: i,
            monthName: getMonthName(i),
            totalSales: 0,
            totalReturn: 0,
            totalSalesQty: 0,
            totalReturnQty: 0,
            MOM: 0,
          });
        }
        Object.keys(monthlyRevenueKeyValueData).forEach(function (key) {
          let totalMonthlySales = 0;
          let totalMonthlyReturn = 0;
          let totalMonthlySalesQty = 0;
          let totalMonthlyReturnQty = 0;
          let MOM = 0;
          for (let sale of monthlyRevenueKeyValueData[key]) {
            if (sale.status === "Sales") {
              totalMonthlySales += sale.sale_price * sale.sale_qty;
              totalMonthlySalesQty += sale.sale_qty;
            }

            if (sale.status === "Return" || sale.status === "RTO") {
              totalMonthlyReturn += sale.sale_price * sale.sale_qty;
              totalMonthlyReturnQty += sale.sale_qty;
            }
          }

          if (key > 1) {
            if (monthlyRevenueData[key - 2].totalSalesQty != 0) {
              MOM = parseFloat(
                (totalMonthlySalesQty * 100) /
                  monthlyRevenueData[key - 2].totalSalesQty
              ).toFixed(2);
            } else {
              MOM = parseFloat(totalMonthlySalesQty);
            }
          }

          monthlyRevenueData[key - 1] = {
            month: parseInt(key),
            monthName: getMonthName(parseInt(key)),
            totalSales: totalMonthlySales,
            totalReturn: totalMonthlyReturn,
            totalSalesQty: totalMonthlySalesQty,
            totalReturnQty: Math.abs(totalMonthlyReturnQty),
            MOM,
          };
          totalYearlySales += totalMonthlySales;
          totalYearlyReturn += totalMonthlyReturn;
          totalYearlySalesQty += totalMonthlySalesQty;
          totalYearlyReturnQty += totalMonthlyReturnQty;
        });
        yearlyRevenueData.push({
          year: key,
          monthlyRevenueData,
          totalYearlySales,
          totalYearlyReturn,
          totalYearlySalesQty,
          totalYearlyReturnQty: Math.abs(totalYearlyReturnQty),
        });
      });
      data.yearlyRevenueData = yearlyRevenueData;
    }

    let response = {
      brand_data: brandData,
      totalSales,
      totalReturn,
      totalQty,
      totalRevenue,
    };

    return res.status(200).json(success("OK", response, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const salesReturnDataAsPerField = (data, field) => {
  let fieldWiseKeyValueData = groupBy(data, field);
  let fieldWiseData = [];
  Object.keys(fieldWiseKeyValueData).forEach(function (key) {
    let totalSales = 0;
    let totalReturn = 0;
    let totalSalesQty = 0;
    let totalReturnQty = 0;
    for (let sale of fieldWiseKeyValueData[key]) {
      if (sale.status === "Sales") {
        totalSales += sale.sale_price * sale.sale_qty;
        totalSalesQty += sale.sale_qty;
      }

      if (sale.status === "Return" || sale.status === "RTO") {
        totalReturn += sale.sale_price * sale.sale_qty;
        totalReturnQty += sale.sale_qty;
      }
    }
    fieldWiseData.push({
      field: key,
      totalSales,
      totalReturn,
      totalSalesQty,
      totalReturnQty: Math.abs(totalReturnQty),
      totalEntries: fieldWiseKeyValueData[key].length,
    });
  });
  return fieldWiseData;
};

module.exports = {
  createBrand,
  listBrands,
  updateBrandSales,
  brandData,
};
