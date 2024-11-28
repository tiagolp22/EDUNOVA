const router = require('express').Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validateUser } = require('../validators/userValidator');

/**
 * User Routes
 * All routes are prefixed with /api/users
 */

// Apply authentication middleware to all user routes
router.use(auth);

// Get all users - Admin only
router.get('/all', authorize(['admin']), UserController.getAllUsers);

// Get current authenticated user's data
router.get('/me', UserController.getCurrentUser);

// Get a user by ID - Admin or the user themselves
router.get('/:id', UserController.getUserById);

// Update a user - Admin or the user themselves
router.put('/:id', validateUser, UserController.updateUser);

// Delete a user - Admin only
router.delete('/:id', authorize(['admin']), UserController.deleteUser);

module.exports = router;
