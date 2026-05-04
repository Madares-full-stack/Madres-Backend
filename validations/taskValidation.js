const Joi = require('joi');

exports.createTaskValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  subjectId: Joi.string().hex().length(24).required(),
  teacherId: Joi.string().hex().length(24).required(),
  classId: Joi.string().hex().length(24).required(),
  dueDate: Joi.date().required(),
  maxScore: Joi.number().required()
});

exports.updateTaskValidator = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  subjectId: Joi.string().hex().length(24),
  teacherId: Joi.string().hex().length(24),
  classId: Joi.string().hex().length(24),
  dueDate: Joi.date(),
  maxScore: Joi.number()
});