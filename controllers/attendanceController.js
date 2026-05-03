const attendanceModel = require("../models/attendanceSchema");

const getMyAttendance = async (req, res) => {
  try {
    let record;
    if (req.user.role.name === "student") {
      record = await attendanceModel.find({
        studentId: req.user._id,
      });
      return res.status(200).json({
        success: true,
        attendance: record,
      });
    }

    if (req.user.role.name === "parent") {
      record = await attendanceModel.find({
        studentId: { $in: req.user.children  || [] },
      });
      return res.status(200).json({ success: true, attendance: record });
    }
    if (req.user.role.name === "admin" || req.user.role.name === "teacher") {
      record = await attendanceModel.find({});
      return res.status(200).json({
        success: true,
        attendance: record,
      });
    }
  } catch (err) {
    return serverError(req, res);
  }
};

const getAttendance = async (req, res) => {
  try {
    const result = await attendanceModel.find({}).populate("studentId", "name");
    if (result.length === 0) {
      res.status(404).json({
        success: false,
        message: "No attendance found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "All attendance was found ",
        attendance: result,
      });
    }
    return res.status(200).json({ success: true, attendance: result });
  } catch (err) {
    return serverError(req, res);
  }
};

const createAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    const record = new attendanceModel({
      studentId,
      date,
      status,
    });
    const saved = await record.save();
    res.status(201).json({
      success: true,
      result: saved,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "No attendance found" });
    }
    return res.status(200).json({ success: true, attendance: result });
  } catch (err) {
    return serverError(req, res);
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Attendance deleted successfully" });
  } catch (err) {
    return serverError(req, res);
  }
};

module.exports = {
  getAttendance,
  createAttendance,
  getMyAttendance,
  deleteAttendance,
  updateAttendance,
};
