const BaseController = require('./base/BaseController');
const { Course, User, Category, Status } = require('../models');
const redisClient = require('../services/redisClient');
const { validateCourse } = require('../validators/courseValidator');
const { sequelize } = require('../config/db');

class CourseController extends BaseController {
  constructor() {
    super(Course);
  }

  async createCourse(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const validation = validateCourse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: 'Validation error', details: validation.errors });
      }

      const teacher = await User.findByPk(req.body.teacher_id);
      if (!teacher || !['admin', 'teacher'].includes(teacher.privilege?.name)) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Invalid teacher_id or insufficient privileges' });
      }

      const course = await Course.create(req.body, { transaction });
      
      await transaction.commit();

      const courseWithDetails = await Course.findByPk(course.id, {
        include: this.getCourseIncludes()
      });

      await redisClient.del('courses_list');
      
      return res.status(201).json(this.formatResponse(courseWithDetails));
    } catch (error) {
      await transaction.rollback();
      return this.handleError(error, res);
    }
  }

  async updateCourse(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const course = await Course.findByPk(id);
      
      if (!course) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Course not found' });
      }

      if (!req.user.canEditCourse(id)) {
        await transaction.rollback();
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      const validation = validateCourse(req.body, true);
      if (!validation.success) {
        await transaction.rollback();
        return res.status(400).json({ error: 'Validation error', details: validation.errors });
      }

      await course.update(req.body, { transaction });
      await transaction.commit();

      const updatedCourse = await Course.findByPk(id, {
        include: this.getCourseIncludes()
      });

      await redisClient.del(`course_${id}`);
      await redisClient.del('courses_list');

      return res.json(this.formatResponse(updatedCourse));
    } catch (error) {
      await transaction.rollback();
      return this.handleError(error, res);
    }
  }

  async listCourses(req, res) {
    try {
      const { page = 1, limit = 10, status, category, search } = req.query;
      const cacheKey = `courses_${page}_${limit}_${status}_${category}_${search}`;
      
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) return res.json(JSON.parse(cachedData));

      const where = {};
      if (status) where.status_id = status;
      if (category) where.category_id = category;
      if (search) {
        where[Op.or] = [
          { 'title.en': { [Op.iLike]: `%${search}%` } },
          { 'title.pt': { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { rows: courses, count } = await Course.findAndCountAll({
        where,
        include: this.getCourseIncludes(),
        limit: parseInt(limit),
        offset: (page - 1) * parseInt(limit),
        order: [['created_at', 'DESC']]
      });

      const result = {
        courses,
        pagination: {
          total: count,
          pages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      };

      await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 300);

      return res.json(this.formatResponse(result));
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  getCourseIncludes() {
    return [
      { model: User, as: 'teacher', attributes: ['username', 'email'] },
      { model: Category, as: 'category', attributes: ['name'] },
      { model: Status, as: 'status', attributes: ['name'] }
    ];
  }
}

module.exports = new CourseController();