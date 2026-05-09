const express = require("express");
const gradesRouter = express.Router();
const {
  createGrade,
  getGradeById,
  getGrades,
  updateGrades,
  deleteGrades,
  getMyGrades,
} = require("../controllers/gradesController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/auth.middleware");

gradesRouter.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "teacher", "student", "parent"),
  getGrades,
);
gradesRouter.get(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "teacher", "student", "parent"),
  getGradeById,
);
gradesRouter.get(
  "/my",
  verifyToken,
  authorizeRoles("admin", "teacher", "student", "parent"),
  getMyGrades,
);
gradesRouter.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "teacher"),
  createGrade,
);
gradesRouter.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "teacher"),
  updateGrades,
);
gradesRouter.delete("/:id", verifyToken, authorizeRoles("admin"), deleteGrades);
module.exports = gradesRouter;
