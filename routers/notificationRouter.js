const express = require("express");
const router = express.Router();
const { sendNotification, getMyNotifications, markAsRead, markAllAsRead } = require("../controllers/notificationController");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getMyNotifications);
router.post("/send", verifyToken, authorizeRoles("teacher", "parent"), sendNotification);
router.patch("/read-all", verifyToken, markAllAsRead);
router.patch("/:id/read", verifyToken, markAsRead);

module.exports = router;