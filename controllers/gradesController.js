const gradesModel = require("../models/gradesSchema");
const classModel = require("../models/classSchema");
const User = require("../models/user.model");

const serverError = (req, res) => {
  return res.status(500).json({
    success: false,
    message: "Server error",
  });
};

const getGrades = async (req, res) => {
  try {
    const result = await gradesModel
      .find({})
      .populate("student", "name email")
      .populate("subject", "name");

    res.status(200).json({
      success: true,
      count: result.length,
      grades: result,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const getMyGrades = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const role = req.user.role?.name;
    const _id = req.user._id;
    let result = [];

    if (role === "student") {
      result = await gradesModel
        .find({ student: _id })
        .populate("student", "name email")
        .populate("subject", "name");

    } else if (role === "parent") {
      const parent = await User.findById(_id);
      const childIds = (parent.children || []).map((c) => c._id ?? c);

      if (childIds.length === 0) {
        return res.status(200).json({ success: true, grades: [] });
      }

      result = await gradesModel
        .find({ student: { $in: childIds } })
        .populate("student", "name email")
        .populate("subject", "name");

    } else {
      return res.status(403).json({
        success: false,
        message: "Use GET /grades for admin/teacher access",
      });
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      grades: result,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const getClassGrades = async (req, res) => {
  try {
    const { classId } = req.params;

    const classDoc = await classModel
      .findById(classId)
      .populate("students", "_id");

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const studentIds = classDoc.students.map((s) => s._id);

    const result = await gradesModel
      .find({ student: { $in: studentIds } })
      .populate("student", "name email")
      .populate("subject", "name");

    return res.status(200).json({
      success: true,
      count: result.length,
      grades: result,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const getGradeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await gradesModel
      .findById(id)
      .populate("student", "name email")
      .populate("subject", "name");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Grade not found",
      });
    }

    res.status(200).json({
      success: true,
      grade: result,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const createGrade = async (req, res) => {
  try {
    const { student, subject, score } = req.body;

    if (!student || !subject || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "student, subject, and score are required",
      });
    }

    const studentClass = await classModel.findOne({ students: student });
    if (!studentClass) {
      return res.status(400).json({
        success: false,
        message: "Student must be enrolled in a class before adding grades",
      });
    }

    const exists = await gradesModel.findOne({ student, subject });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Grade already exists for this student and subject. Use update instead.",
      });
    }

    const newGrade = await gradesModel.create({ student, subject, score });
    const populated = await gradesModel
      .findById(newGrade._id)
      .populate("student", "name email")
      .populate("subject", "name");

    res.status(201).json({
      success: true,
      message: "Grade created successfully",
      grade: populated,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const updateGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;

    if (score === undefined) {
      return res.status(400).json({
        success: false,
        message: "score is required",
      });
    }

    const result = await gradesModel
      .findByIdAndUpdate(id, { score }, { new: true, runValidators: true })
      .populate("student", "name email")
      .populate("subject", "name");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Grade not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Grade updated successfully",
      grade: result,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const deleteGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await gradesModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Grade not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Grade deleted successfully",
    });
  } catch (err) {
    return serverError(req, res);
  }
};

module.exports = {
  getGrades,
  getMyGrades,
  getClassGrades,
  getGradeById,
  createGrade,
  updateGrades,
  deleteGrades,
};