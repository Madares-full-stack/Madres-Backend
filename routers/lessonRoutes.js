const express = require('express');
const router = express.Router();
const {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const { verifyToken, authorizeRoles }  = require('../middlewares/auth.middleware');
const { uploadLessonFiles } = require('../middlewares/uploadMiddleware');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { createLessonValidator, updateLessonValidator } = require('../validations/lessonValidation');

router.route('/')
  .get(verifyToken, getAllLessons)
  .post(
    verifyToken,
    authorizeRoles('admin', 'teacher'),
    uploadLessonFiles,
    validatorMiddleware(createLessonValidator),
    createLesson
  );

router.route('/:id')
  .get(verifyToken, getLessonById)
  .put(
    verifyToken,
    authorizeRoles('admin', 'teacher'),
    uploadLessonFiles,
    validatorMiddleware(updateLessonValidator),
    updateLesson
  )
  .delete(verifyToken, authorizeRoles('admin', 'teacher'), deleteLesson);

module.exports = router;