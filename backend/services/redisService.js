const Redis = require('ioredis');
const logger = require('../utils/logger');
const { ApplicationError } = require('../utils/errors');

class RedisService {
  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3
    });

    this.client.on('error', (error) => {
      logger.error('Redis client error:', error);
    });
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      throw new ApplicationError('Cache retrieval failed');
    }
  }

  async set(key, value, expirySeconds = 3600) {
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', expirySeconds);
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      throw new ApplicationError('Cache storage failed');
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      throw new ApplicationError('Cache deletion failed');
    }
  }

  async clearPattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (error) {
      logger.error(`Redis pattern clear error for ${pattern}:`, error);
      throw new ApplicationError('Cache pattern clearing failed');
    }
  }
}

module.exports = new RedisService();