const attendanceModel = require("../models/attendanceSchema");

const serverError = (res) => res.status(500).json({ success: false, message: "Server error" });

const getMyAttendance = async (req, res) => {
  try {
    const roleName = req.user?.role?.name;
    let record;
    if (roleName === "student") {
      record = await attendanceModel.find({ studentId: req.user._id });
    } else if (roleName === "parent") {
      record = await attendanceModel.find({ studentId: { $in: req.user.children || [] } });
    } else if (roleName === "admin" || roleName === "teacher") {
      record = await attendanceModel.find({});
    } else {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    return res.status(200).json({ success: true, attendance: record });
  } catch (err) {
    return serverError(res);
  }
};

const getAttendance = async (req, res) => {
  try {
    const result = await attendanceModel.find({}).populate("studentId", "name");
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "No attendance found" });
    }
    return res.status(200).json({ success: true, attendance: result });
  } catch (err) {
    return serverError(res);
  }
};

const createAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    const record = new attendanceModel({ studentId, date, status });
    const saved = await record.save();
    return res.status(201).json({ success: true, result: saved });
  } catch (err) {
    return serverError(res);
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) return res.status(404).json({ success: false, message: "No attendance found" });
    return res.status(200).json({ success: true, attendance: result });
  } catch (err) {
    return serverError(res);
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceModel.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ success: false, message: "Not found" });
    return res.status(200).json({ success: true, message: "Attendance deleted successfully" });
  } catch (err) {
    return serverError(res);
  }
};

module.exports = { getAttendance, createAttendance, getMyAttendance, deleteAttendance, updateAttendance };