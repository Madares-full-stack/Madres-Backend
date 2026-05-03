const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/Subject.controller');
const { validateSubject } = require('../middleware/validate');

router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.post('/', validateSubject, createSubject);
router.put('/:id', validateSubject, updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;