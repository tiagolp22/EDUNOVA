const router = require('express').Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validateUser } = require('../validators/userValidator');
const createLimiter = require('../middleware/rateLimiter');

// Authentication middleware
router.use(auth);

// User routes
router.get('/all', authorize(['admin']), UserController.getAllUsers.bind(UserController));
router.get('/me', UserController.getCurrentUser.bind(UserController));
router.get('/:id', UserController.getUserById.bind(UserController));
router.put('/:id', validateUser, UserController.updateUser.bind(UserController));
router.delete('/:id', authorize(['admin']), UserController.deleteUser.bind(UserController));

module.exports = router;
