const jwt = require('jsonwebtoken');
const { User, Privilege } = require('../models');
const redisClient = require('../services/redisClient');

/**
 * Middleware to authenticate JWT tokens.
 * Attaches the authenticated user to the request object.
 */
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token missing' });

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist_${token}`);
    if (isBlacklisted) return res.status(401).json({ error: 'Token revoked' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      where: { id: decoded.id },
      include: [{ 
        model: Privilege,
        as: 'privilege',
        attributes: ['name']
      }],
      attributes: { exclude: ['password'] }
    });

    if (!user) return res.status(401).json({ error: 'User not found' });

    const userData = user.toJSON();

    // Extract the English name for the privilege
    userData.privilege.name = userData.privilege.name.en;

    req.user = userData;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;
