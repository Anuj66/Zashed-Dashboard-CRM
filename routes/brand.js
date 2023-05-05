const express = require("express");
const BrandController = require("../controller/brand");
const { uploadExcel } = require("../middleware/uploadFile");
const { validate } = require("../middleware/validate");
const { createBrand } = require("../validators/brand");
const authenticate = require("../middleware/auth");

const router = new express.Router();

router.post(
  "/createBrand",
  authenticate,
  uploadExcel.single("file"),
  validate(createBrand),
  BrandController.createBrand
);

module.exports = router;
