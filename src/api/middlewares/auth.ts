// import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
  var token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided." });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });
    }

    next();
  });
};

module.exports = { verifyJWT };
