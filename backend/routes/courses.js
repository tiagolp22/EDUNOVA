// routes/courses.js
const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const authenticateToken = require("../middleware/auth");
const { body, param } = require("express-validator");

// All routes below require authentication
router.use(authenticateToken);

// Create a new course
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("subtitle").notEmpty().withMessage("Subtitle is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price")
      .isDecimal({ min: 0 })
      .withMessage("Price must be a positive decimal"),
    body("status_id").isInt().withMessage("Status ID must be an integer"),
    body("teacher_id").isInt().withMessage("Teacher ID must be an integer"),
  ],
  courseController.createCourse
);

// Get all courses
router.get("/all", courseController.getAllCourses);

// Get a course by ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("Course ID must be an integer")],
  courseController.getCourseById
);

// Update a course
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("Course ID must be an integer"),
    body("price")
      .optional()
      .isDecimal({ min: 0 })
      .withMessage("Price must be a positive decimal"),
    body("status_id")
      .optional()
      .isInt()
      .withMessage("Status ID must be an integer"),
    body("teacher_id")
      .optional()
      .isInt()
      .withMessage("Teacher ID must be an integer"),
  ],
  courseController.updateCourse
);

// Delete a course
router.delete(
  "/:id",
  [param("id").isInt().withMessage("Course ID must be an integer")],
  courseController.deleteCourse
);

module.exports = router;
