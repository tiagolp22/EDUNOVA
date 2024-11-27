const BaseController = require('./base/BaseController');
const { Progress, User, Course, Class } = require('../models');
const redisClient = require('../services/redisClient');

class ProgressController extends BaseController {
  constructor() {
    super(Progress);
  }

  async updateProgress(req, res) {
    const transaction = await sequelize.transaction();
    try {
      if (req.user.privilege_id !== 'student') {
        return res.status(403).json({ error: 'Only students can update progress' });
      }

      const { course_id, class_id, progress_percentage } = req.body;
      const user_id = req.user.id;

      const [course, classObj] = await Promise.all([
        Course.findByPk(course_id),
        Class.findByPk(class_id)
      ]);

      if (!course || !classObj) {
        await transaction.rollback();
        return res.status(404).json({ error: 'Course or class not found' });
      }

      const progress = await Progress.findOne({
        where: { user_id, course_id, class_id }
      }) || await Progress.create({
        user_id,
        course_id,
        class_id,
        progress_percentage: 0,
        last_accessed: new Date()
      });

      await progress.update({
        progress_percentage,
        last_accessed: new Date()
      }, { transaction });

      const totalProgress = await Progress.findAll({
        where: { user_id, course_id }
      });

      const averageProgress = totalProgress.reduce(
        (acc, curr) => acc + curr.progress_percentage, 0
      ) / totalProgress.length;

      await redisClient.del(`progress_${user_id}_${course_id}`);
      await transaction.commit();

      return res.json(this.formatResponse({
        classProgress: progress,
        courseProgress: averageProgress
      }));
    } catch (error) {
      await transaction.rollback();
      return this.handleError(error, res);
    }
  }

  async getUserProgress(req, res) {
    try {
      const { course_id } = req.params;
      const user_id = req.user.id;
      const cacheKey = `progress_${user_id}_${course_id}`;

      const cachedProgress = await redisClient.get(cacheKey);
      if (cachedProgress) {
        return res.json(JSON.parse(cachedProgress));
      }

      const progress = await Progress.findAll({
        where: { user_id, course_id },
        include: [
          { model: Class, as: 'class', attributes: ['title', 'description'] }
        ],
        order: [['last_accessed', 'DESC']]
      });

      const result = {
        progress,
        averageProgress: progress.reduce(
          (acc, curr) => acc + curr.progress_percentage, 0
        ) / (progress.length || 1)
      };

      await redisClient.set(cacheKey, JSON.stringify(result), 'EX', 3600);
      return res.json(this.formatResponse(result));
    } catch (error) {
      return this.handleError(error, res);
    }
  }
}

module.exports = new ProgressController();