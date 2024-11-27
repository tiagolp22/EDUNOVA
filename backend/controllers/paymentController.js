const BaseController = require('./base/BaseController');
const { Payment, Course, User } = require('../models');
const { processPayment } = require('../services/paymentService');

class PaymentController extends BaseController {
  constructor() {
    super(Payment);
  }

  async createPayment(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { course_id, payment_method } = req.body;
      const user_id = req.user.id;

      const course = await Course.findByPk(course_id);
      if (!course) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Course not found' });
      }

      const paymentResult = await processPayment({
        amount: course.price,
        payment_method,
        user_id,
        course_id
      });

      const payment = await Payment.create({
        user_id,
        course_id,
        amount: course.price,
        status: paymentResult.status,
        payment_gateway_response: paymentResult.response,
        payment_method
      }, { transaction });

      if (paymentResult.status === 'completed') {
        await Enrollment.create({
          user_id,
          course_id,
          is_paid: true
        }, { transaction });
      }

      await transaction.commit();
      return res.status(201).json(this.formatResponse(payment));
    } catch (error) {
      await transaction.rollback();
      return this.handleError(error, res);
    }
  }

  async getPaymentHistory(req, res) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const where = {};

      if (req.user.privilege_id === 'student') {
        where.user_id = req.user.id;
      }
      if (status) where.status = status;

      const { rows: payments, count } = await Payment.findAndCountAll({
        where,
        include: [
          { model: User, as: 'user', attributes: ['username', 'email'] },
          { model: Course, as: 'course', attributes: ['title', 'price'] }
        ],
        limit: parseInt(limit),
        offset: (page - 1) * parseInt(limit),
        order: [['payment_date', 'DESC']]
      });

      return res.json(this.formatResponse({
        payments,
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
}

module.exports = new PaymentController();