const mongoose =require("mongoose");
const submissionsSchema= mongoose.Schema({

    task:{type:mongoose.Schema.Types.ObjectId,ref:"Task"},
    student:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    answer:{type:String , required:true},

},

{ timestamps: true }
)

module.exports =mongoose.model("Submissions",submissionsSchema)