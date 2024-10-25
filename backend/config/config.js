// config/config.js

const path = require('path');
const dotenv = require('dotenv');

// Determine the environment
const env = process.env.NODE_ENV || 'development';

// Load environment variables from the corresponding .env file
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

module.exports = {
    /**
     * Database Configuration
     * These settings are used to establish a connection with the PostgreSQL database.
     */
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'mydatabase',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '2213Tb',
    },

    /**
     * Server Configuration
     * These settings determine how the server runs.
     */
    server: {
        port: process.env.PORT || 5000,
    },

    /**
     * JWT Configuration
     * These settings are used for handling JSON Web Tokens (JWT) for authentication.
     */
    jwt: {
        secret: process.env.JWT_SECRET || 'your_jwt_secret',
        expiration: process.env.JWT_EXPIRATION || '36000',
    },

    /**
     * Node Environment
     * Specifies the environment in which the application is running.
     * Can be 'development', 'test', 'production', etc.
     */
    nodeEnv: env,
};
