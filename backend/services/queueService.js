const Bull = require('bull');
const logger = require('../utils/logger');
const emailService = require('./emailService');

class QueueService {
  constructor() {
    this.emailQueue = new Bull('email', {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      }
    });

    this.mediaQueue = new Bull('media', {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
      }
    });

    this.setupQueueHandlers();
  }

  setupQueueHandlers() {
    this.emailQueue.process(async (job) => {
      try {
        const { to, subject, template, data } = job.data;
        await emailService.sendEmail(to, subject, template, data);
      } catch (error) {
        logger.error('Email job failed:', error);
        throw error;
      }
    });

    this.mediaQueue.process(async (job) => {
      try {
        const { fileId, operations } = job.data;
        // Implement media processing logic
      } catch (error) {
        logger.error('Media processing job failed:', error);
        throw error;
      }
    });
  }

  async addEmailJob(data) {
    return this.emailQueue.add(data);
  }

  async addMediaJob(data) {
    return this.mediaQueue.add(data);
  }
}

module.exports = new QueueService();