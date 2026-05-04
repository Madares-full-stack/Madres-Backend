const express = require("express");
const router = express.Router();
const { chat } = require("../controllers/chatBotController");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");


router.post("/", verifyToken, authorizeRoles("student"), chat);

module.exports = router;