// server.js

/**
 * Main server file for the backend application.
 * Sets up Express app, middleware, routes, and starts the server.
 */

// Import required modules
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan'); // Import morgan for logging
const { sequelize, testConnection } = require('./backend/config/db');

// Load environment variables from .env
dotenv.config();

// Import routes
const authRoutes = require('./backend/routes/auth');
const userRoutes = require('./backend/routes/users');
const privilegeRoutes = require('./backend/routes/privileges');
const statusRoutes = require('./backend/routes/statuses');
const courseRoutes = require('./backend/routes/courses');
const classRoutes = require('./backend/routes/classes');
const mediaFileRoutes = require('./backend/routes/mediaFiles');
const enrollmentRoutes = require('./backend/routes/enrollments');
const progressRoutes = require('./backend/routes/progress');
const paymentRoutes = require('./backend/routes/payments');

// Import error handling middleware
const errorHandler = require('./backend/middleware/errorHandler');

// Set up middleware
app.use(express.json()); // Parse JSON request bodies
app.use(helmet());       // Set security-related HTTP headers
app.use(cors());         // Enable Cross-Origin Resource Sharing

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,                // Limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Configure morgan for logging requests (optional)
app.use(morgan('dev'));

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/privileges', privilegeRoutes);
app.use('/api/statuses', statusRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/media-files', mediaFileRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware (should be after all other app.use() calls)
app.use(errorHandler);

// Start the server
const PORT = config.server.port || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync models with the database
    await sequelize.sync({ alter: true });

    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
    process.exit(1); // Exit with failure
  }
};

// Only start the server if not in testing mode
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Export the app for testing
module.exports = app;
