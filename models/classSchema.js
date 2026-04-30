const mongoose =require("mongoose");
const classSchema =mongoose.Schema({
teacher:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
students:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
name:{type:String ,required:true}


})
module.exports = mongoose.model("Class",classSchema)