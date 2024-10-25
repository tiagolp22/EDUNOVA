// controllers/classController.js
const { Class, Course } = require('../config/db').models;

// Create a new class
exports.createClass = async (req, res) => {
    const { title, subtitle, description, video_path, course_id } = req.body;

    try {
        const course = await Course.findByPk(course_id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const newClass = await Class.create({
            title,
            subtitle,
            description,
            video_path,
            course_id
        });

        res.status(201).json(newClass);
    } catch (error) {
        res.status(400).json({ error: 'Error creating class' });
    }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll({
            include: [
                { model: Course, as: 'course', attributes: ['id', 'title'] }
            ]
        });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching classes' });
    }
};

// Get a class by ID
exports.getClassById = async (req, res) => {
    const { id } = req.params;

    try {
        const classObj = await Class.findByPk(id, {
            include: [
                { model: Course, as: 'course', attributes: ['id', 'title'] }
            ]
        });

        if (!classObj) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json(classObj);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching class' });
    }
};

// Update a class
exports.updateClass = async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, description, video_path, course_id } = req.body;

    try {
        const classObj = await Class.findByPk(id);
        if (!classObj) {
            return res.status(404).json({ error: 'Class not found' });
        }

        if (course_id) {
            const course = await Course.findByPk(course_id);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            classObj.course_id = course_id;
        }

        classObj.title = title || classObj.title;
        classObj.subtitle = subtitle || classObj.subtitle;
        classObj.description = description || classObj.description;
        classObj.video_path = video_path || classObj.video_path;

        await classObj.save();

        res.json(classObj);
    } catch (error) {
        res.status(400).json({ error: 'Error updating class' });
    }
};

// Delete a class
exports.deleteClass = async (req, res) => {
    const { id } = req.params;

    try {
        const classObj = await Class.findByPk(id);
        if (!classObj) {
            return res.status(404).json({ error: 'Class not found' });
        }

        await classObj.destroy();
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting class' });
    }
};
