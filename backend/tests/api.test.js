// tests/api.test.js

const request = require('supertest');
const app = require('../server'); // Import the Express app
const { sequelize, models } = require('../backend/config/db');

beforeAll(async () => {
    // Sync the database and recreate tables
    await sequelize.sync({ force: true });

    // Create initial privileges
    await models.Privilege.bulkCreate([
        { name: 'admin' },
        { name: 'teacher' },
        { name: 'student' }
    ]);

    // Create initial statuses
    await models.Status.bulkCreate([
        { name: { en: 'active', pt: 'ativo' } },
        { name: { en: 'inactive', pt: 'inativo' } }
    ]);
});

afterAll(async () => {
    // Close the database connection after tests
    await sequelize.close();
});

describe('Authentication and Authorization', () => {
    let adminToken;
    let teacherToken;
    let studentToken;

    test('Register an admin user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'adminpass',
                privilege_id: 1 // admin
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).not.toHaveProperty('password');
    });

    test('Register a teacher user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Teacher User',
                email: 'teacher@example.com',
                password: 'teacherpass',
                privilege_id: 2 // teacher
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).not.toHaveProperty('password');
    });

    test('Register a student user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Student User',
                email: 'student@example.com',
                password: 'studentpass',
                privilege_id: 3 // student
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).not.toHaveProperty('password');
    });

    test('Admin user login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'adminpass'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        adminToken = res.body.token;
    });

    test('Teacher user login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'teacher@example.com',
                password: 'teacherpass'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        teacherToken = res.body.token;
    });

    test('Student user login', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'student@example.com',
                password: 'studentpass'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        studentToken = res.body.token;
    });

    test('Access protected route without token', async () => {
        const res = await request(app)
            .get('/api/privileges');
        expect(res.statusCode).toEqual(401);
    });

    test('Admin accessing privileges', async () => {
        const res = await request(app)
            .get('/api/privileges')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('Teacher accessing privileges (should have access if authorized)', async () => {
        const res = await request(app)
            .get('/api/privileges')
            .set('Authorization', `Bearer ${teacherToken}`);
        // Depending on your authorization middleware, adjust expectations
        // Assuming teachers have read access
        expect(res.statusCode).toEqual(200);
    });

    test('Student accessing privileges (should be forbidden)', async () => {
        const res = await request(app)
            .get('/api/privileges')
            .set('Authorization', `Bearer ${studentToken}`);
        // Assuming students do not have access
        expect(res.statusCode).toEqual(403);
    });
});

describe('CRUD Operations for Courses', () => {
    let adminToken;
    let teacherToken;
    let courseId;

    beforeAll(async () => {
        // Login as admin and teacher to obtain tokens
        const adminRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@example.com',
                password: 'adminpass'
            });
        adminToken = adminRes.body.token;

        const teacherRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'teacher@example.com',
                password: 'teacherpass'
            });
        teacherToken = teacherRes.body.token;
    });

    test('Admin creates a new course', async () => {
        const res = await request(app)
            .post('/api/courses')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: { en: 'Node.js Basics', pt: 'Noções Básicas de Node.js' },
                subtitle: { en: 'Learn the fundamentals of Node.js', pt: 'Aprenda os fundamentos do Node.js' },
                description: { en: 'This course covers the basics of Node.js.', pt: 'Este curso cobre o básico de Node.js.' },
                price: 199.99,
                status_id: 1, // active
                teacher_id: 2 // Teacher User ID
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        courseId = res.body.id;
    });

    test('Teacher retrieves all courses', async () => {
        const res = await request(app)
            .get('/api/courses')
            .set('Authorization', `Bearer ${teacherToken}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('Teacher retrieves a course by ID', async () => {
        const res = await request(app)
            .get(`/api/courses/${courseId}`)
            .set('Authorization', `Bearer ${teacherToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', courseId);
    });

    test('Teacher updates a course', async () => {
        const res = await request(app)
            .put(`/api/courses/${courseId}`)
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({
                price: 149.99
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('price', '149.99'); // Sequelize returns DECIMAL as string
    });

    test('Teacher deletes a course', async () => {
        const res = await request(app)
            .delete(`/api/courses/${courseId}`)
            .set('Authorization', `Bearer ${teacherToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Course deleted successfully');
    });
});
