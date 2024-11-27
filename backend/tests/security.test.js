const request = require('supertest');
const app = require('../server');
const { getAuthToken } = require('./utils/helpers');

describe('Security Tests', () => {
  let normalToken, expiredToken;

  beforeAll(async () => {
    normalToken = await getAuthToken('user');
    expiredToken = 'expired.token.here';
  });

  describe('Security Headers', () => {
    it('should set security headers correctly', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff');
      expect(response.headers).toHaveProperty('x-frame-options', 'DENY');
      expect(response.headers).toHaveProperty('x-xss-protection', '1; mode=block');
      expect(response.headers).toHaveProperty('strict-transport-security');
      expect(response.headers).toHaveProperty('content-security-policy');
    });
  });

  describe('Authentication', () => {
    it('should reject requests without token', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(401);
    });

    it('should reject expired tokens', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${expiredToken}`);
      expect(response.status).toBe(401);
    });

    it('should rate limit login attempts', async () => {
      const attempts = Array(6).fill({
        email: 'test@test.com',
        password: 'wrong'
      });

      for (const attempt of attempts) {
        await request(app)
          .post('/api/auth/login')
          .send(attempt);
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@test.com',
          password: 'test123'
        });

      expect(response.status).toBe(429);
    });
  });

  describe('Input Validation', () => {
    it('should sanitize SQL injection attempts', async () => {
      const response = await request(app)
        .get('/api/users?search=1 OR 1=1')
        .set('Authorization', `Bearer ${normalToken}`);

      expect(response.status).not.toBe(500);
    });

    it('should prevent XSS attacks', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${normalToken}`)
        .send({
          name: '<script>alert("xss")</script>'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('Authorization', () => {
    it('should prevent unauthorized access to admin routes', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${normalToken}`);

      expect(response.status).toBe(403);
    });
  });
});