const router = require('express').Router();
const ProgressController = require('../controllers/ProgressController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(auth);

router.post('/', authorize(['student']), ProgressController.updateProgress);
router.get('/:course_id', ProgressController.getUserProgress);

module.exports = router;