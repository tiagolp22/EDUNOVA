// routes/mediaFiles.js
const express = require('express');
const router = express.Router();
const mediaFileController = require('../controllers/mediaFileController');
const authenticateToken = require('../middleware/auth');
const { body, param } = require('express-validator');

// All routes below require authentication
router.use(authenticateToken);

// Create a new media file
router.post('/', [
    body('file_type').isIn(['pdf', 'image', 'video']).withMessage('File type must be pdf, image, or video'),
    body('file_path').notEmpty().withMessage('File path is required'),
    body('course_id').optional().isInt().withMessage('Course ID must be an integer'),
    body('class_id').optional().isInt().withMessage('Class ID must be an integer')
], mediaFileController.createMediaFile);

// Get all media files
router.get('/', mediaFileController.getAllMediaFiles);

// Get a media file by ID
router.get('/:id', [
    param('id').isInt().withMessage('Media File ID must be an integer')
], mediaFileController.getMediaFileById);

// Update a media file
router.put('/:id', [
    param('id').isInt().withMessage('Media File ID must be an integer'),
    body('file_type').optional().isIn(['pdf', 'image', 'video']).withMessage('File type must be pdf, image, or video')
], mediaFileController.updateMediaFile);

// Delete a media file
router.delete('/:id', [
    param('id').isInt().withMessage('Media File ID must be an integer')
], mediaFileController.deleteMediaFile);

module.exports = router;
