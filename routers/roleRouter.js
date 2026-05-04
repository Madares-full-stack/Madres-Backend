const express = require("express");
const roleRouter = express.Router();
const { getRole, createRole } = require("../controllers/roleController");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

roleRouter.get("/", getRole);
roleRouter.post("/", createRole);

module.exports = roleRouter;