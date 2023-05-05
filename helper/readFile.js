const xls = require("convert-excel-to-json");
const path = require("path");

const readExcelFile = (file) => {
  const absPath = path.join(__dirname, "..", file.destination, file.filename);
  const result = xls({
    sourceFile: absPath,
  });
  return result;
};

module.exports = { readExcelFile };
