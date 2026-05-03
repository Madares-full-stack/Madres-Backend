const express = require("express");
const roleRouter = express.Router();
const { getRole, createRole } = require("../controllers/roleController");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

roleRouter.get("/", verifyToken, authorizeRoles("admin"), getRole);
roleRouter.post("/", verifyToken, authorizeRoles("admin"), createRole);

module.exports = roleRouter;