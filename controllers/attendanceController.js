const attendanceModel = require("../models/attendanceSchema");
const getMyAttendance = async (req, res) => {
  try {
    let record;
    if (req.user.role.name === "student") {
      record = await attendanceModel.find({
        studentId: req.user._Id,
      });
    }
    if (req.user.role.name === "parent") {
      record = await attendanceModel.find({
        studentId: { $in: req.user.children },
      });

      res.status(200).json({
        success: true,
        attendance: record,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    const result = await attendanceModel.find({});
    if (!result) {
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
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
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
    record.save();
    res.status(201).json({
      success: true,
      result: record,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const result = await attendanceModel.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!result) {
      res.status(404).json({
        success: false,
        message: "No attendance found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Attendance updated successfully ",
        attendance: result,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceModel.findByIdAndDelete(id);
    if (!result) {
      res.status(404).json({
        success: false,
        message: "Not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Attendance delete successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getAttendance,
  createAttendance,
  getMyAttendance,
  deleteAttendance,
  updateAttendance,
};
