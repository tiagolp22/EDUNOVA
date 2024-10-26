const { Enrollment, User, Course } = require('../config/db').models;
const { sendEnrollmentConfirmation } = require('../services/emailService');
const { Op } = require('sequelize');

/**
 * Create a new enrollment - Only accessible by students
 */
exports.createEnrollment = async (req, res) => {
    if (req.user.privilege_id !== 'student') {
        return res.status(403).json({ error: 'Only students can enroll' });
    }

    const { user_id, course_id } = req.body;

    try {
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const course = await Course.findByPk(course_id);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        // Check if prerequisites are met
        const prerequisites = await course.getPrerequisites();
        for (let prereq of prerequisites) {
            const completed = await Enrollment.findOne({
                where: { user_id, course_id: prereq.id, status: 'completed' }
            });
            if (!completed) {
                return res.status(400).json({ error: `Prerequisite not met: ${prereq.title}` });
            }
        }

        // Create enrollment and send confirmation email
        const enrollment = await Enrollment.create({ user_id, course_id });
        sendEnrollmentConfirmation(user.email, course.title);

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ error: 'Error creating enrollment' });
    }
};

/**
 * Retrieve all enrollments - Accessible by admins and teachers
 */
exports.getAllEnrollments = async (req, res) => {
    if (req.user.privilege_id === 'student') {
        return res.status(403).json({ error: 'Insufficient privileges' });
    }

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

/**
 * Retrieve a specific enrollment by ID - Accessible by the enrolled student, teachers, and admins
 */
exports.getEnrollmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const enrollment = await Enrollment.findByPk(id, {
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Course, as: 'course', attributes: ['id', 'title'] }
            ]
        });

        if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

        // Check if the student is accessing their own enrollment
        if (req.user.privilege_id === 'student' && req.user.id !== enrollment.user_id) {
            return res.status(403).json({ error: 'Insufficient privileges to view this enrollment' });
        }

        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching enrollment' });
    }
};

/**
 * Update an enrollment - Only accessible by admins and the enrolled student
 */
exports.updateEnrollment = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const enrollment = await Enrollment.findByPk(id);
        if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

        // Check if the user is the enrolled student or an admin
        if (req.user.privilege_id === 'student' && req.user.id !== enrollment.user_id) {
            return res.status(403).json({ error: 'Insufficient privileges to update this enrollment' });
        }

        // Update status directly
        enrollment.status = status || enrollment.status;
        await enrollment.save();

        res.json(enrollment);
    } catch (error) {
        res.status(500).json({ error: 'Error updating enrollment' });
    }
};

/**
 * Delete an enrollment - Only accessible by admins
 */
exports.deleteEnrollment = async (req, res) => {
    if (req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Only admins can delete enrollments' });
    }

    const { id } = req.params;

    try {
        const enrollment = await Enrollment.findByPk(id);
        if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

        await enrollment.destroy();
        res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting enrollment' });
    }
};
