const { Progress, User, Course, Class } = require('../config/db').models;
const redisClient = require('../services/redisClient');

/**
 * Update user's progress in a class - Only accessible by students
 */
exports.updateProgress = async (req, res) => {
    if (req.user.privilege_id !== 'student') {
        return res.status(403).json({ error: 'Only students can update progress' });
    }

    const { user_id, course_id, class_id, progress_percentage, last_accessed } = req.body;

    try {
        // Check user, course, and class existence
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const course = await Course.findByPk(course_id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const classObj = await Class.findByPk(class_id);
        if (!classObj) return res.status(404).json({ error: 'Class not found' });

        // Retrieve or create progress entry
        let progress = await Progress.findOne({ where: { user_id, course_id, class_id } });
        if (!progress) {
            progress = await Progress.create({
                user_id,
                course_id,
                class_id,
                progress_percentage,
                last_accessed
            });
        } else {
            progress.progress_percentage = progress_percentage !== undefined ? progress_percentage : progress.progress_percentage;
            progress.last_accessed = last_accessed || progress.last_accessed;
            await progress.save();
        }

        // Clear progress cache
        await redisClient.del(`progress_${user_id}_${course_id}`);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Error updating progress' });
    }
};

/**
 * Get user's progress in a course with caching - Accessible by teachers, admins, and the student
 */
exports.getUserProgress = async (req, res) => {
    const { user_id, course_id } = req.params;
    const cacheKey = `progress_${user_id}_${course_id}`;

    try {
        // Check access privileges
        if (req.user.privilege_id === 'student' && req.user.id !== parseInt(user_id)) {
            return res.status(403).json({ error: 'Insufficient privileges to view this progress' });
        }

        const cachedProgress = await redisClient.get(cacheKey);
        if (cachedProgress) return res.json(JSON.parse(cachedProgress));

        const progress = await Progress.findAll({
            where: { user_id, course_id },
            include: [
                { model: Class, as: 'class', attributes: ['id', 'title'] }
            ]
        });

        await redisClient.set(cacheKey, JSON.stringify(progress), 'EX', 3600); // Cache for 1 hour
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching progress' });
    }
};
