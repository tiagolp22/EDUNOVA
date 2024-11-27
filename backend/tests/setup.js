const { sequelize } = require('../config/db');
const request = require('supertest');
const app = require('../server');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

global.request = request(app);