const { Course, Status, User } = require('../config/db').models;
const Queue = require('bull');
const courseQueue = new Queue('courseQueue');
const slugify = require('slugify'); // For SEO-friendly URLs
const redisClient = require('../services/redisClient'); // Redis for caching

/**
 * Create a new course - Only accessible by teachers and admins
 */
exports.createCourse = async (req, res) => {
    if (req.user.privilege_id !== 'teacher' && req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges' });
    }

    const { title, subtitle, description, price, status_id, teacher_id } = req.body;

    try {
        // Generate a slug for SEO-friendly URL
        const slug = slugify(title, { lower: true, strict: true });

        // Add to queue for asynchronous creation
        courseQueue.add({ title, subtitle, description, price, status_id, teacher_id, slug });

        // Clear cache as a new course is added
        await redisClient.del('all_courses');
        res.status(202).json({ message: 'Course creation in progress' });
    } catch (error) {
        res.status(500).json({ error: 'Error queuing course creation' });
    }
};

// Process asynchronous course creation
courseQueue.process(async (job) => {
    const { title, subtitle, description, price, status_id, teacher_id, slug } = job.data;
    await Course.create({ title, subtitle, description, price, status_id, teacher_id, slug });
});

/**
 * Retrieve all courses with caching - Accessible by all users
 */
exports.getAllCourses = async (req, res) => {
    const cacheKey = 'all_courses';

    try {
        const cachedCourses = await redisClient.get(cacheKey);
        if (cachedCourses) return res.json(JSON.parse(cachedCourses));

        const courses = await Course.findAll({
            include: [
                { model: Status, as: 'status' },
                { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }
            ]
        });

        await redisClient.set(cacheKey, JSON.stringify(courses), 'EX', 3600); // Cache for 1 hour
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
};

/**
 * Retrieve a course by ID with caching - Accessible by all users
 */
exports.getCourseById = async (req, res) => {
    const { id } = req.params;
    const cacheKey = `course_${id}`;

    try {
        const cachedCourse = await redisClient.get(cacheKey);
        if (cachedCourse) return res.json(JSON.parse(cachedCourse));

        const course = await Course.findByPk(id, {
            include: [
                { model: Status, as: 'status' },
                { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }
            ]
        });

        if (!course) return res.status(404).json({ error: 'Course not found' });

        await redisClient.set(cacheKey, JSON.stringify(course), 'EX', 3600); // Cache for 1 hour
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching course' });
    }
};

/**
 * Update a course - Only accessible by teachers and admins
 */
exports.updateCourse = async (req, res) => {
    if (req.user.privilege_id !== 'teacher' && req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges' });
    }

    const { id } = req.params;
    const { title, subtitle, description, price, status_id, teacher_id } = req.body;

    try {
        const course = await Course.findByPk(id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        // Update the slug if the title changes
        const updatedData = {
            title,
            subtitle,
            description,
            price,
            status_id,
            teacher_id,
            slug: title ? slugify(title, { lower: true, strict: true }) : course.slug
        };

        await Course.update(updatedData, { where: { id } });

        // Clear caches as the course details are updated
        await redisClient.del('all_courses');
        await redisClient.del(`course_${id}`);
        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating course' });
    }
};

/**
 * Delete a course - Only accessible by admins
 */
exports.deleteCourse = async (req, res) => {
    if (req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Only admins can delete courses' });
    }

    const { id } = req.params;

    try {
        const course = await Course.findByPk(id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        await course.destroy();

        // Clear caches as a course is deleted
        await redisClient.del('all_courses');
        await redisClient.del(`course_${id}`);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting course' });
    }
};
