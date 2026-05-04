const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { createScheduleValidator, updateScheduleValidator } = require('../validations/scheduleValidation');

router.route('/')
  .get(verifyToken, getAllSchedules)
  .post(
    verifyToken,
    authorizeRoles('admin', 'teacher'),
    validatorMiddleware(createScheduleValidator),
    createSchedule
  );

router.route('/:id')
  .get(verifyToken, getScheduleById)
  .put(
    verifyToken,
    authorizeRoles('admin', 'teacher'),
    validatorMiddleware(updateScheduleValidator),
    updateSchedule
  )
  .delete(verifyToken, authorizeRoles('admin', 'teacher'), deleteSchedule);

module.exports = router;