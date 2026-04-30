const mongoose =require("mongoose");
const gradesSchema =mongoose.Schema({
    student:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    subject:{type:mongoose.Schema.Types.ObjectId,ref:"Subject"},
    score:{type:Number,required:true},
  

},
{ timestamps: true }
)

module.exports=mongoose.model("Grades",gradesSchema)