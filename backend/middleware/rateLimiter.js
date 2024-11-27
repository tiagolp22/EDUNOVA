const rateLimit = require('express-rate-limit');

const createLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
    max: options.max || 100, // Limit each IP
    message: {
      error: options.message || 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for admin users
      return req.user?.privilege?.name === 'admin';
    }
  });
};

module.exports = createLimiter;