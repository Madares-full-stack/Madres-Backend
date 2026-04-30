const express =require("express")
const classRouter=express.Router();
const {getClass,getClasses,deleteClass,updateClass,createClass}= require("../controllers/classController");
const { create } = require("../models/roleSchema");

classRouter.get("/",getClasses);
classRouter.get("/:id",getClass);
classRouter.post("/",createClass);
classRouter.put("/:id",updateClass);
classRouter.delete("/:id",deleteClass)


module.exports =classRouter