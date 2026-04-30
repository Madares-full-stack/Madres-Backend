const express= require("express")

const attendanceRouter= express.Router();
const {createAttendance,updateAttendance,deleteAttendance,getMyAttendance, getAttendance}=require("../controllers/attendanceController")

attendanceRouter.get("/my",getMyAttendance),
attendanceRouter.post("/",createAttendance),
attendanceRouter.put("/:id",updateAttendance),
attendanceRouter.delete("/:id",deleteAttendance)
attendanceRouter.get("/",getAttendance)

module.exports =attendanceRouter