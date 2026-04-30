const express = require("express");
const submissionRouter=express.Router();
const {getSubmission,createSubmission,updateSubmission,deleteSubmission}=require("../controllers/submissionsController")

submissionRouter.get("/",getSubmission),
submissionRouter.post("/",createSubmission),
submissionRouter.put("/:id",updateSubmission),
submissionRouter.delete("/:id",deleteSubmission)


module.exports=submissionRouter