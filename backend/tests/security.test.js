// tests/security.test.js

const request = require('supertest');
const app = require('../server'); // Import the Express app

describe('Security Headers', () => {
  test('should have security headers set by Helmet', async () => {
    const res = await request(app).get('/api/auth');
    expect(res.headers).toHaveProperty('x-dns-prefetch-control', 'off');
    expect(res.headers).toHaveProperty('x-frame-options', 'SAMEORIGIN');
    expect(res.headers).toHaveProperty('strict-transport-security');
    expect(res.headers).toHaveProperty('x-download-options', 'noopen');
    expect(res.headers).toHaveProperty('x-content-type-options', 'nosniff');
    expect(res.headers).toHaveProperty('x-xss-protection', '0');
  });
});
