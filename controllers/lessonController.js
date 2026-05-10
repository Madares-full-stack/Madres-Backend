const asyncHandler = require('express-async-handler');
const Lesson = require('../models/Lesson');
const ApiError = require('../utils/apiError');

exports.getMyLessons = asyncHandler(async (req, res, next) => {
  const userRole = req.user.role?.name;
  const userId = req.user._id;

  let lessons = [];

  if (userRole === "student") {
    const Class = require('../models/classSchema');
    const studentClass = await Class.findOne({ students: userId });

    if (!studentClass) {
      return res.status(200).json({ results: 0, data: [] });
    }

    lessons = await Lesson.find({ classId: studentClass._id })
      .populate('subjectId', 'name')
      .populate('teacherId', 'name')
      .populate('classId', 'name');

  } else if (userRole === "teacher") {
    lessons = await Lesson.find({ teacherId: userId })
      .populate('subjectId', 'name')
      .populate('classId', 'name');

  } else if (userRole === "parent") {
    const User = require('../models/user.model');
    const Class = require('../models/classSchema');

    const parent = await User.findById(userId);
    const childIds = parent.children || [];

    if (childIds.length === 0) {
      return res.status(200).json({ results: 0, data: [] });
    }

    const classes = await Class.find({ students: { $in: childIds } });
    const classIds = classes.map(c => c._id);

    lessons = await Lesson.find({ classId: { $in: classIds } })
      .populate('subjectId', 'name')
      .populate('teacherId', 'name')
      .populate('classId', 'name');

  } else {
    return next(new ApiError('Access forbidden', 403));
  }

  res.status(200).json({ results: lessons.length, data: lessons });
});

exports.createLesson = asyncHandler(async (req, res, next) => {
  if (req.files) {
    if (req.files.video) req.body.videoUrl = req.files.video[0].originalname;
    if (req.files.file) req.body.fileUrl = req.files.file[0].originalname;
  }

  const newLesson = await Lesson.create(req.body);
  res.status(201).json({ data: newLesson });
});

exports.getAllLessons = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const reqQuery = { ...req.query };
  const removeFields = ['page', 'sort', 'limit', 'fields'];
  removeFields.forEach((val) => delete reqQuery[val]);

  const lessons = await Lesson.find(reqQuery)
    .skip(skip)
    .limit(limit)
    .populate('subjectId', 'name')
    .populate('teacherId', 'userId')
    .populate('classId', 'name');

  res.status(200).json({ results: lessons.length, page, data: lessons });
});

exports.getLessonById = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id)
    .populate('subjectId')
    .populate('teacherId')
    .populate('classId');

  if (!lesson) {
    return next(new ApiError('Lesson not found', 404));
  }

  res.status(200).json({ data: lesson });
});

exports.updateLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!lesson) {
    return next(new ApiError('Lesson not found', 404));
  }

  res.status(200).json({ data: lesson });
});

exports.deleteLesson = asyncHandler(async (req, res, next) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);

  if (!lesson) {
    return next(new ApiError('Lesson not found', 404));
  }

  res.status(204).json();
});