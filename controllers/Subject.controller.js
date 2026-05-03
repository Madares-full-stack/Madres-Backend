const Subject = require('../models/subjectSchema');


const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('teacher', 'name email') // adjust fields based on your User model
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate(
      'teacher',
      'name email'
    );

    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: 'Subject not found' });
    }

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const createSubject = async (req, res) => {
  try {
    const { name, teacher } = req.body;

    const subject = await Subject.create({ name, teacher });
    const populated = await subject.populate('teacher', 'name email');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};


const updateSubject = async (req, res) => {
  try {
    const { name, teacher } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, teacher },
      { new: true, runValidators: true }
    ).populate('teacher', 'name email');

    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: 'Subject not found' });
    }

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: 'Subject not found' });
    }

    res.status(200).json({ success: true, message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};