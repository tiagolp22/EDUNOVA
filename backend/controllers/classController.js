const { Class, Course } = require('../config/db').models;
const redisClient = require('../services/redisClient');

/**
 * Create a new class - Only accessible by teachers and admins
 */
exports.createClass = async (req, res) => {
    if (req.user.privilege_id !== 'teacher' && req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges' });
    }

    const { title, subtitle, description, video_path, course_id } = req.body;

    try {
        const course = await Course.findByPk(course_id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const newClass = await Class.create({ title, subtitle, description, video_path, course_id });

        // Clear cache for classes list
        await redisClient.del('all_classes');
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ error: 'Error creating class' });
    }
};

/**
 * Retrieve all classes with caching - Accessible by all users
 */
exports.getAllClasses = async (req, res) => {
    const cacheKey = 'all_classes';

    try {
        const cachedClasses = await redisClient.get(cacheKey);
        if (cachedClasses) return res.json(JSON.parse(cachedClasses));

        const classes = await Class.findAll({
            include: [{ model: Course, as: 'course', attributes: ['id', 'title'] }],
        });

        await redisClient.set(cacheKey, JSON.stringify(classes), 'EX', 3600); // Cache for 1 hour
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching classes' });
    }
};

/**
 * Retrieve a class by ID - Accessible by all users
 */
exports.getClassById = async (req, res) => {
    const { id } = req.params;

    try {
        const classObj = await Class.findByPk(id, {
            include: [{ model: Course, as: 'course', attributes: ['id', 'title'] }],
        });

        if (!classObj) return res.status(404).json({ error: 'Class not found' });

        res.json(classObj);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching class' });
    }
};

/**
 * Update a class - Only accessible by teachers and admins
 */
exports.updateClass = async (req, res) => {
    if (req.user.privilege_id !== 'teacher' && req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges' });
    }

    const { id } = req.params;
    const { title, subtitle, description, video_path, course_id } = req.body;

    try {
        const classObj = await Class.findByPk(id);
        if (!classObj) return res.status(404).json({ error: 'Class not found' });

        if (course_id) {
            const course = await Course.findByPk(course_id);
            if (!course) return res.status(404).json({ error: 'Course not found' });
        }

        // Direct update for efficiency
        await Class.update(
            { title, subtitle, description, video_path, course_id },
            { where: { id } }
        );

        // Clear cache for classes list
        await redisClient.del('all_classes');
        res.json({ message: 'Class updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating class' });
    }
};

/**
 * Delete a class - Only accessible by teachers and admins
 */
exports.deleteClass = async (req, res) => {
    if (req.user.privilege_id !== 'teacher' && req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges' });
    }

    const { id } = req.params;

    try {
        const classObj = await Class.findByPk(id);
        if (!classObj) return res.status(404).json({ error: 'Class not found' });

        await classObj.destroy();

        // Clear cache for classes list
        await redisClient.del('all_classes');
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting class' });
    }
};
