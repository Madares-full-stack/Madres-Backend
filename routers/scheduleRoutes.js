const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { createScheduleValidator, updateScheduleValidator } = require('../validations/scheduleValidation');

router.route('/')
  .get(protect, getAllSchedules)
  .post(
    protect,
    restrictTo('admin', 'teacher'),
    validatorMiddleware(createScheduleValidator),
    createSchedule
  );

router.route('/:id')
  .get(protect, getScheduleById)
  .put(
    protect,
    restrictTo('admin', 'teacher'),
    validatorMiddleware(updateScheduleValidator),
    updateSchedule
  )
  .delete(protect, restrictTo('admin', 'teacher'), deleteSchedule);

module.exports = router;