const mongoose=require("mongoose");

const attendanceSchema = mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["present", "absent"], required: true },
},{timestamps:true});
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model("Attendance", attendanceSchema);