const express = require('express');
const router = express.Router();
const {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { uploadLessonFiles } = require('../middlewares/uploadMiddleware');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { createLessonValidator, updateLessonValidator } = require('../validations/lessonValidation');

router.route('/')
  .get(protect, getAllLessons)
  .post(
    protect,
    restrictTo('admin', 'teacher'),
    uploadLessonFiles,
    validatorMiddleware(createLessonValidator),
    createLesson
  );

router.route('/:id')
  .get(protect, getLessonById)
  .put(
    protect,
    restrictTo('admin', 'teacher'),
    uploadLessonFiles,
    validatorMiddleware(updateLessonValidator),
    updateLesson
  )
  .delete(protect, restrictTo('admin', 'teacher'), deleteLesson);

module.exports = router;