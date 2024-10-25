// routes/progress.js
const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authenticateToken = require('../middleware/auth');
const { body, param } = require('express-validator');

// All routes below require authentication
router.use(authenticateToken);

// Update user progress in a class
router.post('/', [
    body('user_id').isInt().withMessage('User ID must be an integer'),
    body('course_id').isInt().withMessage('Course ID must be an integer'),
    body('class_id').isInt().withMessage('Class ID must be an integer'),
    body('progress_percentage').optional().isDecimal({ min: 0, max: 100 }).withMessage('Progress percentage must be between 0 and 100'),
    body('last_accessed').optional().isISO8601().withMessage('Last accessed must be a valid date')
], progressController.updateProgress);

// Get user progress in a specific course
router.get('/:user_id/:course_id', [
    param('user_id').isInt().withMessage('User ID must be an integer'),
    param('course_id').isInt().withMessage('Course ID must be an integer')
], progressController.getUserProgress);

module.exports = router;
