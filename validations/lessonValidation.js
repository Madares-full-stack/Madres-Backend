const Joi = require('joi');

exports.createLessonValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  subjectId: Joi.string().hex().length(24).required(),
  teacherId: Joi.string().hex().length(24).required(),
  classId: Joi.string().hex().length(24).required()
});

exports.updateLessonValidator = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  subjectId: Joi.string().hex().length(24),
  teacherId: Joi.string().hex().length(24),
  classId: Joi.string().hex().length(24)
});