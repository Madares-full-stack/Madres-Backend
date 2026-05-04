const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).populate("role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    

    if (!req.user || !roles.includes(req.user?.role?.name)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role(s): ${roles.join(", ")}`,
      });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
