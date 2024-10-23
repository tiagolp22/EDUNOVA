const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// User registration
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password with a salt round of 10
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user with the hashed password
        const newUser = await User.create({ name, email, password: hashedPassword });
        // Respond with the created user
        res.status(201).json(newUser);
    } catch (error) {
        // Handle errors during user creation
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
            // Respond with an error if the user is not found
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            // Respond with an error if the password is invalid
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate a JWT token with the user's id and email
        const token = jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, {
            expiresIn: config.jwt.expiration,
        });

        // Respond with the generated token
        res.json({ token });
    } catch (error) {
        // Handle errors during user login
        res.status(500).json({ error: 'Error logging in user' });
    }
};
