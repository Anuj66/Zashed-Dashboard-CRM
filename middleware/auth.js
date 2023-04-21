const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../helper/constants");
const { error } = require("../helper/baseResponse");

const authenticate = (req, res, next) => {
  const userToken = req.headers.authorization;
  if (!userToken) {
    return res
      .status(401)
      .json(error("Please authenticate using a token", 401));
  }

  try {
    let token = userToken.split(" ");
    const JWT_TOKEN = token[1];
    const data = jwt.verify(JWT_TOKEN, JWT_KEY);
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(500).json(error(err.message, 500));
  }
};

module.exports = authenticate;
