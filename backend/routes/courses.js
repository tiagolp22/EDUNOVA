const router = require('express').Router();
const CourseController = require('../controllers/CourseController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validateCourse } = require('../validators/courseValidator');

router.use(auth);

router.post('/', authorize(['admin', 'teacher']), validateCourse, CourseController.createCourse);
router.get('/', CourseController.listCourses);
router.get('/:id', CourseController.getCourse);
router.put('/:id', authorize(['admin', 'teacher']), validateCourse, CourseController.updateCourse);
router.delete('/:id', authorize(['admin']), CourseController.deleteCourse);

module.exports = router;