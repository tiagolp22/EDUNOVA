const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = 'READONLY';
    return err.message.includes(targetError);
  }
};

const redisClient = new Redis(redisConfig);

redisClient.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

module.exports = redisClient;