const express = require("express");
const router = express.Router();
const { chat } = require("../controllers/chatbot.controller");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");


router.post("/", verifyToken, authorizeRoles("student"), chat);

module.exports = router;