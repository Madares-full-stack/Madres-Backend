const express = require("express");
const attendanceRouter = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");
const {
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getMyAttendance,
  getAttendance,
} = require("../controllers/attendanceController");

attendanceRouter.get("/my", verifyToken, getMyAttendance);
attendanceRouter.get("/", verifyToken, authorizeRoles("admin", "teacher"), getAttendance);
attendanceRouter.post("/", verifyToken, authorizeRoles("admin", "teacher"), createAttendance);
attendanceRouter.put("/:id", verifyToken, authorizeRoles("admin", "teacher"), updateAttendance);
attendanceRouter.delete("/:id", verifyToken, authorizeRoles("admin"), deleteAttendance);

module.exports = attendanceRouter;