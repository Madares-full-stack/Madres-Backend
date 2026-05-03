const express =require("express")
const classRouter=express.Router();
const {getClass,getClasses,deleteClass,updateClass,createClass}= require("../controllers/classController");
const { create } = require("../models/roleSchema");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");


classRouter.get("/", verifyToken, authorizeRoles("admin", "teacher", "student", "parent"), getClasses);
classRouter.get("/:id", verifyToken, authorizeRoles("admin", "teacher", "student", "parent"), getClass);
classRouter.post("/", verifyToken, authorizeRoles("admin"), createClass);
classRouter.put("/:id", verifyToken, authorizeRoles("admin", "teacher"), updateClass);
classRouter.delete("/:id", verifyToken, authorizeRoles("admin"), deleteClass);


module.exports =classRouter