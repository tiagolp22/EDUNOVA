const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(auth);

router.get('/', CategoryController.getCategories);
router.post('/', authorize(['admin']), CategoryController.createCategory);
router.put('/:id', authorize(['admin']), CategoryController.updateCategory);
router.delete('/:id', authorize(['admin']), CategoryController.deleteCategory);

module.exports = router;