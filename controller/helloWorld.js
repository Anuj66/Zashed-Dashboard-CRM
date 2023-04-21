const { error, success } = require("../helper/baseResponse");

const hello = (req, res) => {
  return res.status(200).json(success("OK", { message: "Hello World" }, 200));
};

module.exports = { hello };
