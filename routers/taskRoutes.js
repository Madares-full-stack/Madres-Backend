const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { createTaskValidator, updateTaskValidator } = require('../validations/taskValidation');

router.route('/')
  .get(protect, getAllTasks)
  .post(
    protect,
    restrictTo('admin', 'teacher'),
    validatorMiddleware(createTaskValidator),
    createTask
  );

router.route('/:id')
  .get(protect, getTaskById)
  .put(
    protect,
    restrictTo('admin', 'teacher'),
    validatorMiddleware(updateTaskValidator),
    updateTask
  )
  .delete(protect, restrictTo('admin', 'teacher'), deleteTask);

module.exports = router;