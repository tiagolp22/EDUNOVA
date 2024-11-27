const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const createLimiter = require('../middleware/rateLimiter');

// Rate limiters
const registerLimiter = createLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: 'Too many registration attempts, please try again later.'
});

const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  message: 'Too many login attempts, please try again later.'
});

// Routes
router.post('/register', registerLimiter, AuthController.register);
router.post('/login', loginLimiter, AuthController.login);
router.post('/logout', AuthController.logout);

module.exports = router;