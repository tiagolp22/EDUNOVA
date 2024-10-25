// controllers/enrollmentController.js
const { Enrollment, User, Course } = require('../config/db').models;

// Enroll a user in a course
exports.createEnrollment = async (req, res) => {
    const { user_id, course_id, is_paid } = req.body;

    try {
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const course = await Course.findByPk(course_id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const existingEnrollment = await Enrollment.findOne({
            where: { user_id, course_id }
        });

        if (existingEnrollment) {
            return res.status(400).json({ error: 'User already enrolled in this course' });
        }

        const enrollment = await Enrollment.create({
            user_id,
            course_id,
            is_paid
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(400).json({ error: 'Error creating enrollment' });
    }
};

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Course, as: 'course', attributes: ['id', 'title'] }
            ]
        });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching enrollments' });
    }
};

// Get an enrollment by ID
exports.getEnrollmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const enrollment = await Enrollment.findByPk(id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Course, as: 'course', attributes: ['id', 'title'] }
            ]
        });

        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching enrollment' });
    }
};

// Update an enrollment
exports.updateEnrollment = async (req, res) => {
    const { id } = req.params;
    const { is_paid } = req.body;

    try {
        const enrollment = await Enrollment.findByPk(id);
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        enrollment.is_paid = is_paid !== undefined ? is_paid : enrollment.is_paid;
        await enrollment.save();

        res.json(enrollment);
    } catch (error) {
        res.status(400).json({ error: 'Error updating enrollment' });
    }
};

// Delete an enrollment
exports.deleteEnrollment = async (req, res) => {
    const { id } = req.params;

    try {
        const enrollment = await Enrollment.findByPk(id);
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        await enrollment.destroy();
        res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting enrollment' });
    }
};
