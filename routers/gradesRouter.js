const express =require("express");
const gradesRouter =express.Router();
const {createGrade,getGradeById,getGrades,updateGrades,deleteGrades} =require
("../controllers/gradesController")
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");


gradesRouter.get("/", verifyToken, authorizeRoles("admin", "teacher", "student", "parent"), getGrades);
gradesRouter.get("/:id", verifyToken, authorizeRoles("admin", "teacher", "student", "parent"), getGradeById);
gradesRouter.post("/", verifyToken, authorizeRoles("admin", "teacher"), createGrade);
gradesRouter.put("/:id", verifyToken, authorizeRoles("admin", "teacher"), updateGrades);
gradesRouter.delete("/:id", verifyToken, authorizeRoles("admin"), deleteGrades);
module.exports =gradesRouter