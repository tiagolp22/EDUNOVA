// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

// Test route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the backend API!' });
});

// Registration route
router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('privilege_id').isInt().withMessage('Privilege ID must be an integer')
], authController.register);

// Login route
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], authController.login);

module.exports = router;
