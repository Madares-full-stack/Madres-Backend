const mongoose=require("mongoose");
const attendanceSchema =mongoose.Schema({
    studentId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    date:{type:Date,default:Date.now},
    status:{type:String,enum: ["present","absent"] ,required:true},

    createAt:{type:Date,default:Date.now}
})
module.exports =mongoose.model("Attendance",attendanceSchema)