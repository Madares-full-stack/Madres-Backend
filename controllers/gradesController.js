const gradesModel = require("../models/gradesSchema");


const serverError=(req,res)=>{
  return res.status(500).json({
    success:false,
    message:"Server error"
  })
}

//get all Grades
const getGrades = async (req, res) => {
  try {
    const result = await gradesModel
      .find({})
      .populate("student")
      .populate("subject");
    res.status(200).json({
      success: true,
      grades: result,
    });
  } catch (err) {
  return serverError(req,res)
  }
};

//create Grade
const createGrade = async (req, res) => {
  try {
    const { student, subject, score } = req.body;
    const newGrade = new gradesModel({
      student,
      subject,
      score,
    });
    await newGrade.save();
    res.status(201).json({
      success: true,
      grade: newGrade,
    });
  } catch (err) {
  return serverError(req,res)
  }
};

//get one grade
const getGradeById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await gradesModel
      .findById(id)
      .populate("student")
      .populate("subject");
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Grade not found",
      });
    } else {
      res.status(200).json({
        success: true,
        grade: result,
      });
    }
  } catch (err) {
  return serverError(req,res)
  }
};

//update grade
const updateGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const result = await gradesModel.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Grade not found ",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "Grade updated successfully",
      });
    }
  } catch (err) {
  return serverError(req,res)
  }
};

//delete grade 
const deleteGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await gradesModel.findByIdAndDelete(id);

    if(!result){
        return res.status(404).json({
            success:false,
            message:"Grade not found "
        })
    }else{
        res.status(200).json({
            success:true,
            message:"Grade deleted successfully"
        })
    }

  } catch (err) {
   return serverError(req,res)
  }
};

module.exports = {
  getGradeById,
  getGrades,
  createGrade,
  updateGrades,
  deleteGrades,
};