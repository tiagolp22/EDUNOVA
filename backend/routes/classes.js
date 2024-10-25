// routes/classes.js
const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const authenticateToken = require('../middleware/auth');
const { body, param } = require('express-validator');

// All routes below require authentication
router.use(authenticateToken);

// Create a new class
router.post('/', [
    body('title').notEmpty().withMessage('Title is required'),
    body('subtitle').notEmpty().withMessage('Subtitle is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('course_id').isInt().withMessage('Course ID must be an integer'),
    body('video_path').optional().isString().withMessage('Video path must be a string')
], classController.createClass);

// Get all classes
router.get('/', classController.getAllClasses);

// Get a class by ID
router.get('/:id', [
    param('id').isInt().withMessage('Class ID must be an integer')
], classController.getClassById);

// Update a class
router.put('/:id', [
    param('id').isInt().withMessage('Class ID must be an integer'),
    body('course_id').optional().isInt().withMessage('Course ID must be an integer'),
    body('video_path').optional().isString().withMessage('Video path must be a string')
], classController.updateClass);

// Delete a class
router.delete('/:id', [
    param('id').isInt().withMessage('Class ID must be an integer')
], classController.deleteClass);

module.exports = router;
