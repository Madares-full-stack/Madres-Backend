const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const ApiError = require('../utils/apiError');

exports.createTask = asyncHandler(async (req, res, next) => {
  const newTask = await Task.create(req.body);
  res.status(201).json({ data: newTask });
});

exports.getAllTasks = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const reqQuery = { ...req.query };
  const removeFields = ['page', 'sort', 'limit', 'fields'];
  removeFields.forEach((val) => delete reqQuery[val]);

  const tasks = await Task.find(reqQuery)
    .skip(skip)
    .limit(limit)
    .populate('subjectId', 'name')
    .populate('teacherId', 'userId')
    .populate('classId', 'name');

  res.status(200).json({ results: tasks.length, page, data: tasks });
});

exports.getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('subjectId')
    .populate('teacherId')
    .populate('classId');

  if (!task) {
    return next(new ApiError('Task not found', 404));
  }

  res.status(200).json({ data: task });
});

exports.updateTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!task) {
    return next(new ApiError('Task not found', 404));
  }

  res.status(200).json({ data: task });
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new ApiError('Task not found', 404));
  }

  res.status(204).json();
});