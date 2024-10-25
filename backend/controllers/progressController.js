// controllers/progressController.js
const { Progress, User, Course, Class } = require('../config/db').models;

// Update user's progress in a class
exports.updateProgress = async (req, res) => {
    const { user_id, course_id, class_id, progress_percentage, last_accessed } = req.body;

    try {
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const course = await Course.findByPk(course_id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const classObj = await Class.findByPk(class_id);
        if (!classObj) {
            return res.status(404).json({ error: 'Class not found' });
        }

        let progress = await Progress.findOne({
            where: { user_id, course_id, class_id }
        });

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

        res.json(progress);
    } catch (error) {
        res.status(400).json({ error: 'Error updating progress' });
    }
};

// Get user's progress in a course
exports.getUserProgress = async (req, res) => {
    const { user_id, course_id } = req.params;

    try {
        const progress = await Progress.findAll({
            where: { user_id, course_id },
            include: [
                { model: Class, as: 'class', attributes: ['id', 'title'] }
            ]
        });

        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching progress' });
    }
};
