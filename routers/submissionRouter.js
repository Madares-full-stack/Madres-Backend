const express = require("express");
const submissionRouter=express.Router();
const {getSubmission,createSubmission,updateSubmission,deleteSubmission}=require("../controllers/submissionsController")
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

submissionRouter.get("/", verifyToken, authorizeRoles("admin", "teacher"), getSubmission);
submissionRouter.post("/", verifyToken, authorizeRoles("student"), createSubmission);
submissionRouter.put("/:id", verifyToken, authorizeRoles("admin", "teacher"), updateSubmission);
submissionRouter.delete("/:id", verifyToken, authorizeRoles("admin"), deleteSubmission);


module.exports=submissionRouter