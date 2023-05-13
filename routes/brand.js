const express = require("express");
const BrandController = require("../controller/brand");
const { uploadExcel } = require("../middleware/uploadFile");
const { validate } = require("../middleware/validate");
const { createBrand, updateBrandSales } = require("../validators/brand");
const authenticate = require("../middleware/auth");

const router = new express.Router();

router.post(
  "/createBrand",
  authenticate,
  uploadExcel.single("file"),
  validate(createBrand),
  BrandController.createBrand
);
router.get("/listBrands", authenticate, BrandController.listBrands);
router.put(
  "/updateBrandSales",
  authenticate,
  uploadExcel.single("file"),
  validate(updateBrandSales),
  BrandController.updateBrandSales
);
router.post("/getBrandData", authenticate, BrandController.brandData);

module.exports = router;
