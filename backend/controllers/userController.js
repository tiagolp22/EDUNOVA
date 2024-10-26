// userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/db').models;
const redisClient = require('../services/redisClient');
const config = require('../config/config');

/**
 * Register a new user - Accessible by all
 */
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        const { password: _, ...userWithoutPassword } = newUser.toJSON();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};

/**
 * User login - Accessible by all registered users
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign(
            { id: user.id, email: user.email, privilege_id: user.privilege_id },
            config.jwt.secret,
            { expiresIn: config.jwt.expiration }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in user' });
    }
};

/**
 * Get all users - Only accessible by admins with optional caching
 */
exports.getAllUsers = async (req, res) => {
    if (req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Only admins can view users' });
    }

    const cacheKey = 'all_users';

    try {
        const cachedUsers = await redisClient.get(cacheKey);
        if (cachedUsers) return res.json(JSON.parse(cachedUsers));

        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        await redisClient.set(cacheKey, JSON.stringify(users), 'EX', 3600); // Cache for 1 hour

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

/**
 * Get a specific user by ID - Only accessible by admins
 */
exports.getUserById = async (req, res) => {
    if (req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Only admins can view user details' });
    }

    const { id } = req.params;

    try {
        const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

/**
 * Update a user's information - Only accessible by admins
 */
exports.updateUser = async (req, res) => {
    if (req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Only admins can update users' });
    }

    const { id } = req.params;
    const { name, email, password, privilege_id } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.name = name || user.name;
        user.email = email || user.email;
        user.privilege_id = privilege_id || user.privilege_id;

        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();

        await redisClient.del('all_users'); // Clear users cache
        const { password: _, ...userWithoutPassword } = user.toJSON();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

/**
 * Delete a user - Only accessible by admins
 */
exports.deleteUser = async (req, res) => {
    if (req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Only admins can delete users' });
    }

    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        await user.destroy();

        await redisClient.del('all_users'); // Clear users cache
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};
