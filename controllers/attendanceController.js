const attendanceModel = require("../models/attendanceSchema");

const getMyAttendance = async (req, res) => {
  try {
    let record;
    if (req.user.role.name === "student") {
      record = await attendanceModel.find({ 
        studentId: req.user._id
      });
       res.status(200).json({
        success: true,
        attendance: record
      });
    }
    if (req.user.role.name === "parent") {
      record = await attendanceModel.find({
        studentId: { $in: req.user.children },
      });
      return res.status(200).json({
        success: true,
        attendance: record,
      });
    }
    return res.status(403).json({ 
      success: false,
      message: "Forbidden" 
    });
  } catch (err) {
    return res.status(500).json({ 
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
        message: "No attendance found"
      });
    }
    return res.status(200).json({
      success: true, 
      attendance: result
    });
  } catch (err) {
    return res.status(500).json({
      success: false, 
      message: "Server error" 
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
    await record.save();
    return res.status(201).json({ 
      success: true,
      result: record 
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: "Server error"
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "No attendance found"
      });
    }
    return res.status(200).json({ 
      success: true,
      attendance: result
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error" 
    });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await attendanceModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        success: false, 
        message: "Not found" 
      });
    }
    return res.status(200).json({ 
      success: true, 
      message: "Attendance deleted successfully" 
    });
  } catch (err) {
    return res.status(500).json({ 
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
