const express = require("express");
const gradesRouter = express.Router();
const {
  createGrade,
  getGradeById,
  getGrades,
  updateGrades,
  deleteGrades,
  getClassGrades,
  getMyGrades,
} = require("../controllers/gradesController");
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");

gradesRouter.get("/", verifyToken, authorizeRoles("admin", "teacher", "student", "parent"), getGrades);
gradesRouter.get("/my", verifyToken, authorizeRoles("student", "parent"), getMyGrades);
gradesRouter.get("/class/:classId", verifyToken, authorizeRoles("admin", "teacher"), getClassGrades); 
gradesRouter.get("/:id", verifyToken, authorizeRoles("admin", "teacher", "student", "parent"), getGradeById);
gradesRouter.post("/", verifyToken, authorizeRoles("admin", "teacher"), createGrade);
gradesRouter.put("/:id", verifyToken, authorizeRoles("admin", "teacher"), updateGrades);
gradesRouter.delete("/:id", verifyToken, authorizeRoles("admin"), deleteGrades);

module.exports = gradesRouter;