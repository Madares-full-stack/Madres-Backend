const attendanceModel = require("../models/attendanceSchema");
const serverError = (req, res) => {
  return res.status(500).json({
    success: false,
    message: "Server error",
  });
};

const getMyAttendance = async (req, res) => {
  try {
    let record;
    if (req.user.role.name === "student") {
      record = await attendanceModel
        .find({
          studentId: req.user._id,
        })
        .populate("studentId");
      return res.status(200).json({
        success: true,
        attendance: record,
      });
    }

    if (req.user.role.name === "parent") {
      const childIds = (req.user.children || []).map(
        (child) => child._id || child,
      );

      record = await attendanceModel
        .find({
          studentId: { $in: childIds },
        })
        .populate("studentId", "name classId");

      return res.status(200).json({
        success: true,
        attendance: record,
      });
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
      return res.status(404).json({
        success: false,
        message: "No attendance found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All attendance found",
      attendance: result,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const createAttendance = async (req, res) => {
  try {
    const { record } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const studentIds = record.map((r) => r.studentId);
    console.log(studentIds);

    const existingRecords = await attendanceModel
      .find({
        studentId: { $in: studentIds },
        date: { $gte: today },
      })
      .select("studentId");

    const existingIdSet = new Set(
      existingRecords.map((r) => r.studentId.toString()),
    );

    const dataToInsert = record
      .filter((r) => !existingIdSet.has(r.studentId.toString()))
      .map((r) => ({
        studentId: r.studentId,
        status: r.status,
        date: new Date(),
      }));

    if (dataToInsert.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No new records to save; all duplicates ignored.",
      });
    }

    const saved = await attendanceModel.insertMany(dataToInsert);

    return res.status(201).json({
      success: true,
      message: `${saved.length} records saved successfully.`,
      result: saved,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
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
