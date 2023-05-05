const multer = require("multer");
const path = require("path");
const mkdirp = require("mkdirp");
const { TMP_UPLOAD_PATH } = require("../helper/constants");
const { error } = require("../helper/baseResponse");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    mkdirp.sync(TMP_UPLOAD_PATH);
    callback(null, TMP_UPLOAD_PATH);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadAny = multer({
  storage: storage,
});

const uploadExcel = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      console.log("Excel check successfull");
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .xlsx files are allowed"));
    }
  },
});

const validateFileUpload = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    res.status(400).json(error(err.message, 400));
  } else {
    // An unknown error occurred when uploading.
    res.status(400).json(error(err.message, 400));
  }
};

module.exports = {
  storage,
  validateFileUpload,
  uploadAny,
  uploadExcel,
};
