const request = require('supertest');
const app = require('../server');
const { getAuthToken, createUser, createTestCourse } = require('./utils/helpers');
const { sequelize } = require('../config/db');

describe('API Integration Tests', () => {
  let adminToken, userToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    adminToken = await getAuthToken('admin');
    userToken = await getAuthToken('user');
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
    });
  });

  describe('Authentication Flow', () => {
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!'
    };

    it('should register -> login -> access protected route', async () => {
      // Register
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      expect(registerRes.status).toBe(201);

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      expect(loginRes.status).toBe(200);
      expect(loginRes.body.data).toHaveProperty('token');

      // Access protected route
      const protectedRes = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${loginRes.body.data.token}`);
      expect(protectedRes.status).toBe(200);
    });
  });

  describe('CRUD Operations', () => {
    let courseId;

    it('should perform CRUD operations on courses', async () => {
      // Create
      const createRes = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: { en: 'Test Course', pt: 'Curso Teste' },
          description: { en: 'Description', pt: 'Descrição' },
          price: 99.99
        });
      expect(createRes.status).toBe(201);
      courseId = createRes.body.data.id;

      // Read
      const readRes = await request(app)
        .get(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(readRes.status).toBe(200);

      // Update
      const updateRes = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 149.99 });
      expect(updateRes.status).toBe(200);

      // Delete
      const deleteRes = await request(app)
        .delete(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(deleteRes.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 not found', async () => {
      const res = await request(app)
        .get('/api/nonexistent')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(404);
    });

    it('should handle validation errors', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});