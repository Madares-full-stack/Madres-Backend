const express = require('express');
const router = express.Router();
const {
 getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/Subject.controller');
const { verifyToken, authorizeRoles } = require("../middlewares/auth.middleware");
const {validateSubject} = require("../middlewares/validate")


router.get("/", verifyToken, authorizeRoles("admin", "teacher", "student", "parent"), getAllSubjects);
router.get("/:id", verifyToken, authorizeRoles("admin", "teacher", "student", "parent"), getSubjectById);
router.post("/", verifyToken, authorizeRoles("admin"), validateSubject, createSubject);
router.put("/:id", verifyToken, authorizeRoles("admin"), validateSubject, updateSubject);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteSubject);
module.exports = router;