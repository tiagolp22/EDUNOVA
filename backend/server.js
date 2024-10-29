// server.js

/**
 * Main server file for the backend application.
 * Sets up Express app, middleware, routes, and starts the server.
 */

const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { sequelize, testConnection } = require("./config/db");

// Load environment variables from .env
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const privilegeRoutes = require("./routes/privileges");
const statusRoutes = require("./routes/statuses");
const courseRoutes = require("./routes/courses");
const classRoutes = require("./routes/classes");
const mediaFileRoutes = require("./routes/mediaFiles");
const enrollmentRoutes = require("./routes/enrollments");
const progressRoutes = require("./routes/progress");
const paymentRoutes = require("./routes/payments");

// Import error handling middleware
const errorHandler = require("./middleware/errorHandler");
const authenticateToken = require("./middleware/auth"); // Middleware de autenticação

// Security and logging middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// Set up routes with necessary authentication middleware
app.use("/api/auth", authRoutes); // No auth required
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/privileges", authenticateToken, privilegeRoutes);
app.use("/api/statuses", authenticateToken, statusRoutes);
app.use("/api/courses", authenticateToken, courseRoutes);
app.use("/api/classes", authenticateToken, classRoutes);
app.use("/api/media-files", authenticateToken, mediaFileRoutes);
app.use("/api/enrollments", authenticateToken, enrollmentRoutes);
app.use("/api/progress", authenticateToken, progressRoutes);
app.use("/api/payments", authenticateToken, paymentRoutes);

// Error handling middleware (should be after all other app.use() calls)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;

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
    console.error("Unable to start the server:", error);
    process.exit(1); // Exit with failure
  }
};

// Only start the server if not in testing mode
if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;
