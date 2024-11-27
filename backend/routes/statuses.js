const router = require('express').Router();
const StatusController = require('../controllers/StatusController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(auth);

router.get('/', StatusController.getStatuses);
router.post('/', authorize(['admin']), StatusController.createStatus);
router.put('/:id', authorize(['admin']), StatusController.updateStatus);
router.delete('/:id', authorize(['admin']), StatusController.deleteStatus);

module.exports = router;