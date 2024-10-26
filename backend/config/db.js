// config/db.js

const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');
const fs = require('fs');
const path = require('path');

/**
 * Initialize Sequelize with database configurations.
 */
const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

/**
 * Object to hold all models
 */
const db = {};
const models = {};

// Dynamically load all models from the models directory
fs.readdirSync(path.join(__dirname, '../models'))
  .filter((file) => file.endsWith('.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, '../models', file))(sequelize, DataTypes);
    models[model.name] = model;
  });

// Set up associations between models, if defined
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

/**
 * Test the database connection.
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Export the initialized Sequelize instance and models
db.models = models;
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.testConnection = testConnection;

module.exports = db;
