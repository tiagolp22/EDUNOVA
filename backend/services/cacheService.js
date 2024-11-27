const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3
    });

    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });
  }

  async get(key) {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key, value, expirySeconds = 3600) {
    await this.client.set(
      key,
      JSON.stringify(value),
      'EX',
      expirySeconds
    );
  }

  async del(key) {
    await this.client.del(key);
  }

  async clearPattern(pattern) {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }
}

module.exports = new CacheService();