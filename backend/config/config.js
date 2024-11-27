// config/config.js

const path = require("path");
const dotenv = require("dotenv");

// Determine the environment
const env = process.env.NODE_ENV || "development";

// Load environment variables from the corresponding .env file
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

// Main configuration object
const config = {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "edunova",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "2213Tb",
  },
  server: {
    port: process.env.PORT || 5000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret",
    expiration: process.env.JWT_EXPIRATION || "36000",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
  },
};

module.exports = config;
