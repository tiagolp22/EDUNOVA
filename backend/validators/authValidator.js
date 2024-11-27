const { body } = require('express-validator');

exports.validateRegistration = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase and numbers'),
  body('birthday')
    .optional()
    .isISO8601()
    .withMessage('Birthday must be a valid date'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('privilege_id')
    .optional()
    .isInt()
    .withMessage('Privilege ID must be a valid integer')
];

exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password is required')
];