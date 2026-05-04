const express = require("express");
const router = express.Router();
const { getAllUsers, createUser } = require("../controllers/user.controller");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, authorizeRoles("admin", "teacher"), getAllUsers);
router.post("/", verifyToken, authorizeRoles("admin"), createUser);

module.exports = router;