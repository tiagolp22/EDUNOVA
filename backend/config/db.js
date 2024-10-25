// config/db.js

const { Sequelize } = require('sequelize');
const config = require('./config'); // Ensure this path is correct

/**
 * Initialize Sequelize using the database configuration from config.js
 */
const sequelize = new Sequelize(
    config.db.database, // Database name
    config.db.user,     // Database user
    config.db.password, // Database password
    {
        host: config.db.host,     // Database host
        port: config.db.port,     // Database port
        dialect: 'postgres',      // Database dialect
        logging: false,           // Disable logging; set to console.log to enable
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

/**
 * Import and initialize all models
 */
const modelFiles = [
    '../models/Privilege',
    '../models/User',
    '../models/Status',
    '../models/Course',
    '../models/Class',
    '../models/MediaFile',
    '../models/Enrollment',
    '../models/Progress',
    '../models/Payment',
];

const models = {};

// Initialize each model
modelFiles.forEach(modelPath => {
    try {
        const model = require(modelPath)(sequelize);
        models[model.name] = model;
    } catch (error) {
        console.error(`Error loading model at path ${modelPath}:`, error);
    }
});

/**
 * Set up associations between models, if any
 */
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

/**
 * Test the database connection
 */
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// Export Sequelize instance and models
module.exports = { sequelize, models, testConnection };
