const classModel = require("../models/classSchema");

const serverError = (req, res) => {
  return res.status(500).json({
    success: false,
    message: "Server error",
  });
};

//Get all classes
const getClasses = async (req, res) => {
  try {
    const result = await classModel
      .find({})
      .populate("teacher")
      .populate("students","name");
    if (result.length === 0) {
      res.status(404).json({
        success: false,
        message: "No class was found ",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "All classes",
        classes: result,
      });
    }
  } catch (err) {
    return serverError(req, res);
  }
};

//get one class by id
const getClass = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await classModel.findById(id).populate("teacher").populate("students");
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Class not found ",
      });
    } else {
        return res.status(200).json({
        success: true,
        class: result,
      });
    }
  } catch (err) {
    return serverError(req, res);
  }
};

//create new class
const createClass = async (req, res) => {
  try {
    const { name, teacher, students } = req.body;
    const newClass = new classModel({
      name,
      teacher,
      students,
    });
    console.log(students)
    const saved = await newClass.save();
    const populated = await classModel.findById(saved._id).populate("teacher").populate("students","name");
    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: populated,
    });
  } catch (err) {
   return serverError(req,res)
  }
};
// Update class
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const result = await classModel.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Class not found ",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Class updated successfully",
        class: result,
      });
    }
  } catch (err) {
    return serverError(req, res);
  }
};

//delete class
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await classModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Class not found ",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "class deleted successfully",
      });
    }
  } catch (err) {
   return serverError(req,res)
  }
};

module.exports = {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
};
