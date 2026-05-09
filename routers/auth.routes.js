const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { googleLogin } = require("../controllers/googleController");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

module.exports = router;