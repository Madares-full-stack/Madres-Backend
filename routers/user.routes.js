const express = require("express");
const router = express.Router();
const { getAllUsers, createUser } = require("../controllers/user.controller");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/users", verifyToken, authorizeRoles("admin", "teacher"), getAllUsers);
router.post("/user", verifyToken, authorizeRoles("admin"), createUser);

module.exports = router;