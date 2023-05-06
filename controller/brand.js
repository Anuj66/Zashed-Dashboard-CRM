const { error, success } = require("../helper/baseResponse");
const { ADMIN_ROLE_ID, UPLOAD_BASE_PATH } = require("../helper/constants");
const { moveFile } = require("../helper/fileSystem");
const { readExcelFile } = require("../helper/readFile");
const { userHasRole } = require("../helper/userHasRole");
const DB = require("../models");
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

    const result = readExcelFile(req.file);
    const data = result["Data"];
    data.shift();

    const output = jsonToDbData(data, newBrand.id);
    const savedSalesData = await SalesModel.bulkCreate(output);

    const response = {
      brand: newBrand,
      savedSalesData,
    };

    return res.status(200).json(success("OK", response, 200));
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

const jsonToDbData = (data, brand_id) => {
  const result = [];
  for (let row of data) {
    let temp = {
      brand_id,
    };
    Object.keys(row).forEach(function (key) {
      let val = row[key];
      const out = getSalesData(key, val);
      temp[out.key] = out.value;
    });
    result.push(temp);
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
    return { key: "tax", value: Math.round(parseFloat(val) * 100) };
  }
  if (key == "S") {
    return { key: "sales_tax", value: Math.round(parseFloat(val) * 100) };
  }
  if (key == "T") {
    return { key: "zashed_margin", value: (parseFloat(val) * 100).toFixed(2) };
  }
};

module.exports = {
  createBrand,
};