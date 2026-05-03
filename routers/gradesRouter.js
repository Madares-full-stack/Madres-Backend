const express =require("express");
const gradesRouter =express.Router();
const {createGrade,getGradeById,getGrades,updateGrades,deleteGrades} =require
("../controllers/gradesController")

gradesRouter.get("/",getGrades);
gradesRouter.get("/:id",getGradeById);
gradesRouter.post("/",createGrade);
gradesRouter.put("/:id",updateGrades);
gradesRouter.delete("/:id",deleteGrades)



module.exports =gradesRouter