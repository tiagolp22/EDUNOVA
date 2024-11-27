const router = require('express').Router();
const ClassController = require('../controllers/ClassController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validateClass } = require('../validators/classValidator');

router.use(auth);

router.get('/', ClassController.getAllClasses);
router.get('/:id', ClassController.getClassById);
router.post('/', 
  authorize(['admin', 'teacher']),
  validateClass,
  ClassController.createClass
);
router.put('/:id', 
  authorize(['admin', 'teacher']),
  validateClass,
  ClassController.updateClass
);
router.delete('/:id', authorize(['admin']), ClassController.deleteClass);

module.exports = router;