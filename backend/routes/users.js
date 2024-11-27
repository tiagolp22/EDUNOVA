const router = require('express').Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validateUser } = require('../validators/userValidator');
const createLimiter = require('../middleware/rateLimiter');

// Authentication middleware
router.use(auth);

// User routes
router.get('/all', authorize(['admin']), UserController.getAllUsers);
router.get('/me', UserController.getCurrentUser);
router.get('/:id', UserController.getUserById);
router.put('/:id', validateUser, UserController.updateUser);
router.delete('/:id', authorize(['admin']), UserController.deleteUser);

module.exports = router;