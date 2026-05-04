const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { verifyToken, authorizeRoles }  = require('../middlewares/auth.middleware');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { createTaskValidator, updateTaskValidator } = require('../validations/taskValidation');

router.route('/')
  .get(verifyToken, getAllTasks)
  .post(
    verifyToken,
    authorizeRoles('admin', 'teacher'),
    validatorMiddleware(createTaskValidator),
    createTask
  );

router.route('/:id')
  .get(verifyToken, getTaskById)
  .put(
    verifyToken,
    authorizeRoles('admin', 'teacher'),
    validatorMiddleware(updateTaskValidator),
    updateTask
  )
  .delete(verifyToken, authorizeRoles('admin', 'teacher'), deleteTask);

module.exports = router;