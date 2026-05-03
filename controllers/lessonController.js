const asyncHandler = require('express-async-handler');
const Lesson = require('../models/Lesson');
const ApiError = require('../utils/apiError');

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