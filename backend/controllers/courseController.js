// controllers/courseController.js
const { Course, Status, User } = require('../config/db').models;

// Create a new course
exports.createCourse = async (req, res) => {
    const { title, subtitle, description, price, status_id, teacher_id } = req.body;

    try {
        const course = await Course.create({
            title,
            subtitle,
            description,
            price,
            status_id,
            teacher_id
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: 'Error creating course' });
    }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [
                { model: Status, as: 'status' },
                { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }
            ]
        });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findByPk(id, {
            include: [
                { model: Status, as: 'status' },
                { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }
            ]
        });

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching course' });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, subtitle, description, price, status_id, teacher_id } = req.body;

    try {
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        course.title = title || course.title;
        course.subtitle = subtitle || course.subtitle;
        course.description = description || course.description;
        course.price = price || course.price;
        course.status_id = status_id || course.status_id;
        course.teacher_id = teacher_id || course.teacher_id;

        await course.save();

        res.json(course);
    } catch (error) {
        res.status(400).json({ error: 'Error updating course' });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        await course.destroy();
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting course' });
    }
};
