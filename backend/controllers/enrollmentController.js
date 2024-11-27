const BaseController = require('./base/BaseController');
const { Enrollment, User, Course, Payment } = require('../models');
const { sequelize } = require('../config/db');
const { sendEnrollmentConfirmation } = require('../services/emailService');

class EnrollmentController extends BaseController {
  constructor() {
    super(Enrollment);
  }

  async createEnrollment(req, res) {
    const transaction = await sequelize.transaction();
    try {
      if (req.user.privilege_id !== 'student') {
        await transaction.rollback();
        return res.status(403).json({ error: 'Only students can enroll' });
      }

      const { course_id } = req.body;
      const user_id = req.user.id;

      const [user, course] = await Promise.all([
        User.findByPk(user_id),
        Course.findByPk(course_id, { include: ['prerequisites'] })
      ]);

      if (!user || !course) {
        await transaction.rollback();
        return res.status(404).json({ error: 'User or course not found' });
      }

      // Check prerequisites
      if (course.prerequisites?.length > 0) {
        const completedPrereqs = await Enrollment.findAll({
          where: {
            user_id,
            course_id: course.prerequisites.map(p => p.id),
            status: 'completed'
          }
        });

        if (completedPrereqs.length !== course.prerequisites.length) {
          await transaction.rollback();
          return res.status(400).json({ error: 'Prerequisites not met' });
        }
      }

      // Check if already enrolled
      const existingEnrollment = await Enrollment.findOne({
        where: { user_id, course_id }
      });

      if (existingEnrollment) {
        await transaction.rollback();
        return res.status(409).json({ error: 'Already enrolled in this course' });
      }

      const enrollment = await Enrollment.create(
        { user_id, course_id },
        { transaction }
      );

      await sendEnrollmentConfirmation(user.email, course.title);
      await transaction.commit();

      return res.status(201).json(this.formatResponse(enrollment));
    } catch (error) {
      await transaction.rollback();
      return this.handleError(error, res);
    }
  }

  async getEnrollments(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const where = {};

      if (req.user.privilege_id === 'student') {
        where.user_id = req.user.id;
      }

      if (status) where.status = status;

      const { rows: enrollments, count } = await Enrollment.findAndCountAll({
        where,
        include: [
          { model: User, as: 'user', attributes: ['username', 'email'] },
          { model: Course, as: 'course', attributes: ['title', 'price'] }
        ],
        limit: parseInt(limit),
        offset: (page - 1) * parseInt(limit),
        order: [['enrolled_at', 'DESC']]
      });

      return res.json(this.formatResponse({
        enrollments,
        pagination: {
          total: count,
          pages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      }));
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async updateEnrollmentStatus(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { status } = req.body;

      const enrollment = await Enrollment.findByPk(id, {
        include: [
          { model: User, as: 'user' },
          { model: Course, as: 'course' }
        ]
      });

      if (!enrollment) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Enrollment not found' });
      }

      if (!['active', 'completed', 'cancelled'].includes(status)) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Invalid status' });
      }

      await enrollment.update({ status }, { transaction });
      await transaction.commit();

      return res.json(this.formatResponse(enrollment));
    } catch (error) {
      await transaction.rollback();
      return this.handleError(error, res);
    }
  }
}

module.exports = new EnrollmentController();