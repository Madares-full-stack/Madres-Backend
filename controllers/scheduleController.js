const asyncHandler = require('express-async-handler');
const Schedule = require('../models/Schedule');
const ApiError = require('../utils/apiError');

exports.createSchedule = asyncHandler(async (req, res, next) => {
  const newSchedule = await Schedule.create(req.body);
  res.status(201).json({ data: newSchedule });
});

exports.getAllSchedules = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const reqQuery = { ...req.query };
  const removeFields = ['page', 'sort', 'limit', 'fields'];
  removeFields.forEach((val) => delete reqQuery[val]);

  const schedules = await Schedule.find(reqQuery)
    .skip(skip)
    .limit(limit)
    .populate('classId', 'name')
    .populate('subjectId', 'name')
    .populate('teacherId', 'name');

  res.status(200).json({ results: schedules.length, page, data: schedules });
});

exports.getScheduleById = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.findById(req.params.id)
    .populate('classId')
    .populate('subjectId')
    .populate('teacherId');

  if (!schedule) {
    return next(new ApiError('Schedule not found', 404));
  }

  res.status(200).json({ data: schedule });
});

exports.updateSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!schedule) {
    return next(new ApiError('Schedule not found', 404));
  }

  res.status(200).json({ data: schedule });
});

exports.deleteSchedule = asyncHandler(async (req, res, next) => {
  const schedule = await Schedule.findByIdAndDelete(req.params.id);

  if (!schedule) {
    return next(new ApiError('Schedule not found', 404));
  }

  res.status(204).json();
});