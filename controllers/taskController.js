const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

exports.createTask = asyncHandler(async (req, res, next) => {
  const newTask = await Task.create(req.body);
  res.status(201).json({ data: newTask });
});

exports.getMyTasks = asyncHandler(async (req, res, next) => {
  const userRole = req.user.role?.name;
  const userId = req.user._id;

  let tasks = [];

  if (userRole === "student") {
    const Class = require('../models/classSchema');
    const studentClass = await Class.findOne({ students: userId });

    if (!studentClass) {
      return res.status(200).json({ results: 0, data: [] });
    }

    tasks = await Task.find({ classId: studentClass._id })
      .populate('subjectId', 'name')
      .populate('teacherId', 'name')
      .populate('classId', 'name');

  } else if (userRole === "teacher") {
    tasks = await Task.find({ teacherId: userId })
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

    tasks = await Task.find({ classId: { $in: classIds } })
      .populate('subjectId', 'name')
      .populate('teacherId', 'name')
      .populate('classId', 'name');

  } else {
    tasks = await Task.find()
      .populate('subjectId', 'name')
      .populate('teacherId', 'name')
      .populate('classId', 'name');
  }

  res.status(200).json({ results: tasks.length, data: tasks });
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
    .populate('teacherId', 'name')
    .populate('classId', 'name');

  res.status(200).json({ results: tasks.length, page, data: tasks });
});

exports.getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('subjectId',"name")
    .populate('teacherId',"name")
    .populate('classId',"name");

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