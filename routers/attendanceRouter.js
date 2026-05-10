const express = require("express");
const router = express.Router();
const {
  getAttendance,
  createAttendance,
  getMyAttendance,
  deleteAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");

router.get("/my", verifyToken, getMyAttendance);

router.get("/", verifyToken, authorizeRoles("admin", "teacher"), getAttendance);
router.post("/", verifyToken, authorizeRoles("admin", "teacher"), createAttendance);
router.put("/:id", verifyToken, authorizeRoles("admin", "teacher"), updateAttendance);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteAttendance);

module.exports = router;