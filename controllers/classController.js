const classModel = require("../models/classSchema");

const serverError = (req, res) => {
  return res.status(500).json({
    success: false,
    message: "Server error",
  });
};

const getClasses = async (req, res) => {
  try {
    const result = await classModel
      .find({})
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No class was found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All classes",
      classes: result,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const getClass = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await classModel
      .findById(id)
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    return res.status(200).json({
      success: true,
      class: result,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const getMyClass = async (req, res) => {
  try {
    const userId = req.user._id;

    const userRole =
      req.user.role?.name || req.user.role;

    let result;

    if (userRole === "student") {
      result = await classModel
        .findOne({ students: userId })
        .populate("teacher", "name email")
        .populate("students", "name email");

    } else if (userRole === "teacher") {
      result = await classModel
        .find({ teacher: userId })
        .populate("teacher", "name email")
        .populate("students", "name email");

    } else if (userRole === "parent") {
      const User = require("../models/user.model");

      const parent = await User.findById(userId);

      const childIds =
        parent.children || [];

      result = await classModel
        .find({
          students: { $in: childIds },
        })
        .populate("teacher", "name email")
        .populate("students", "name email");

    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    if (
      !result ||
      (Array.isArray(result) &&
        result.length === 0)
    ) {
      return res.status(200).json({
        success: true,
        class: null,
      });
    }

    return res.status(200).json({
      success: true,
      class: result,
    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const createClass = async (req, res) => {
  try {
    const { name, teacher, students } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Class name is required",
      });
    }

    const newClass = new classModel({ name, teacher, students: students || [] });
    const saved = await newClass.save();
    const populated = await classModel
      .findById(saved._id)
      .populate("teacher", "name email")
      .populate("students", "name email");

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: populated,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const result = await classModel
      .findByIdAndUpdate(id, update, { new: true })
      .populate("teacher", "name email")
      .populate("students", "name email");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      class: result,
    });
  } catch (err) {
    return serverError(req, res);
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await classModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (err) {
    return serverError(req, res);
  }
};

  

module.exports = {
  getClasses,
  getClass,
  getMyClass,
  createClass,
  updateClass,
  deleteClass,
};