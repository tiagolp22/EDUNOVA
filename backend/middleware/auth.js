const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting format: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'Access token missing' });
    }

    jwt.verify(token, config.jwt.secret, (err, user) => {
        if (err) {
            const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid access token';
            return res.status(403).json({ error: message });
        }
        req.user = user; // Attach user info to request
        next();
    });
};

module.exports = authenticateToken;
