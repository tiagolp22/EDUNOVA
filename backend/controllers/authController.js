// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../config/db').models;
const config = require('../config/config');

// User registration
exports.register = async (req, res) => {
    const { name, email, password, privilege_id } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already registered with this email' });
        }

        // Hash the password
        const isMatch = await bcrypt.compare(password, user.password);

        // Create a new user
        const newUser = await User.create({ name, email, password: hashedPassword, privilege_id });

        // Exclude password from response
        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            privilege_id: newUser.privilege_id,
            created_at: newUser.created_at,
            updated_at: newUser.updated_at
        };

        res.status(201).json(userResponse);
    } catch (error) {
        res.status(400).json({ error: 'Error creating user' });
    }
};

// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, {
            expiresIn: config.jwt.expiration,
        });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};
