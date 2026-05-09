const express = require("express");
const router = express.Router();
const { getAllUsers, createUser,getChatUsers ,addChild} = require("../controllers/user.controller");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, authorizeRoles("admin", "teacher"), getAllUsers);
router.post("/", verifyToken, authorizeRoles("admin"), createUser);
router.get("/myChat", verifyToken, getChatUsers);
router.post("/addChild", verifyToken, authorizeRoles("admin"), addChild);

module.exports = router;