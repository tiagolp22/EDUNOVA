const router = require('express').Router();
const MediaFileController = require('../controllers/MediaFileController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../middleware/upload');

router.use(auth);

router.post('/', 
  authorize(['admin', 'teacher']), 
  upload.single('file'),
  MediaFileController.createMediaFile
);
router.get('/:id', MediaFileController.getMediaFile);
router.delete('/:id', authorize(['admin', 'teacher']), MediaFileController.deleteMediaFile);

module.exports = router;