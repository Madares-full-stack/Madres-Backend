const express = require("express");
const roleRouter =express.Router();
const {getRole,createRole}=require("../controllers/roleController")

roleRouter.get("/",getRole);
roleRouter.post('/',createRole);

module.exports =roleRouter