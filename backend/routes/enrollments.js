// routes/enrollments.js
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authenticateToken = require('../middleware/auth');
const { body, param } = require('express-validator');

// All routes below require authentication
router.use(authenticateToken);

// Create a new enrollment
router.post('/', [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('course_id').isInt().withMessage('Course ID must be an integer'),
    body('is_paid').optional().isBoolean().withMessage('is_paid must be a boolean')
], enrollmentController.createEnrollment);

// Get all enrollments
router.get('/', enrollmentController.getAllEnrollments);

// Get an enrollment by ID
router.get('/:id', [
    param('id').isInt().withMessage('Enrollment ID must be an integer')
], enrollmentController.getEnrollmentById);

// Update an enrollment
router.put('/:id', [
    param('id').isInt().withMessage('Enrollment ID must be an integer'),
    body('is_paid').optional().isBoolean().withMessage('is_paid must be a boolean')
], enrollmentController.updateEnrollment);

// Delete an enrollment
router.delete('/:id', [
    param('id').isInt().withMessage('Enrollment ID must be an integer')
], enrollmentController.deleteEnrollment);

module.exports = router;
