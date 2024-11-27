const jwt = require('jsonwebtoken');
const { User, Course } = require('../models');

async function getAuthToken(role) {
  const user = await createUser(role);
  return jwt.sign(
    { id: user.id, role },
    process.env.JWT_SECRET
  );
}

async function createUser(role) {
  return User.create({
    username: `${role}_test`,
    email: `${role}@test.com`,
    password: 'Password123!',
    role
  });
}

async function createTestCourse() {
  return Course.create({
    title: { en: 'Test Course', pt: 'Curso Teste' },
    description: { en: 'Description', pt: 'Descrição' },
    price: 99.99,
    status: 'active'
  });
}

module.exports = {
  getAuthToken,
  createUser,
  createTestCourse
};