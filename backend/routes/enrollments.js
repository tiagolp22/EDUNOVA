const router = require('express').Router();
const EnrollmentController = require('../controllers/EnrollmentController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(auth);

router.post('/', authorize(['student']), EnrollmentController.createEnrollment);
router.get('/', EnrollmentController.getEnrollments);
router.put('/:id/status', authorize(['admin', 'teacher']), EnrollmentController.updateEnrollmentStatus);

module.exports = router;