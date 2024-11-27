const { sequelize } = require('../config/db');
const { models } = sequelize;

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Database Operations', () => {
    test('Create a user directly in the database', async () => {
        const user = await models.User.create({
            name: 'Direct User',
            email: 'directuser@example.com',
            password: 'securepassword'
        });

        expect(user).toHaveProperty('id');
        expect(user.email).toBe('directuser@example.com');
    });

    test('Query a user by email', async () => {
        const user = await models.User.findOne({
            where: { email: 'directuser@example.com' }
        });

        expect(user).not.toBeNull();
        expect(user.email).toBe('directuser@example.com');
    });
});
