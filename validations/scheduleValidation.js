const Joi = require('joi');

exports.createScheduleValidator = Joi.object({
  classId: Joi.string().hex().length(24).required(),
  subjectId: Joi.string().hex().length(24).required(),
  teacherId: Joi.string().hex().length(24).required(),
  day: Joi.string().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required()
});

exports.updateScheduleValidator = Joi.object({
  classId: Joi.string().hex().length(24),
  subjectId: Joi.string().hex().length(24),
  teacherId: Joi.string().hex().length(24),
  day: Joi.string(),
  startTime: Joi.string(),
  endTime: Joi.string()
});