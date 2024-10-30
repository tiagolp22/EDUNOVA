// config/db.js

const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config");
const fs = require("fs");
const path = require("path");

/**
 * Initialize Sequelize with database configurations.
 */
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = {
  models: {}, // Add models object to store all models
};

// Import models dynamically
const modelsDir = path.join(__dirname, "../models");

// Read model files
const modelFiles = fs
  .readdirSync(modelsDir)
  .filter((file) => file.endsWith(".js") && file !== "index.js");

// Load each model
for (const file of modelFiles) {
  try {
    const modelPath = path.join(modelsDir, file);
    const modelDefiner = require(modelPath);

    if (typeof modelDefiner === "function") {
      const model = modelDefiner(sequelize, DataTypes);
      if (model.name) {
        console.log(`✅ Loaded model: ${model.name}`);
        db[model.name] = model; // Add to root level
        db.models[model.name] = model; // Add to models object
      }
    }
  } catch (err) {
    console.error(`❌ Error loading model from file ${file}:`, err);
  }
}

// Set up associations after all models are loaded
Object.keys(db.models).forEach((modelName) => {
  if (typeof db.models[modelName].associate === "function") {
    try {
      db.models[modelName].associate(db.models);
      console.log(`✅ Initialized associations for model: ${modelName}`);
    } catch (err) {
      console.error(`❌ Error setting up associations for ${modelName}:`, err);
    }
  }
});

/**
 * Test the database connection
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

// Add sequelize instances to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.testConnection = testConnection;

module.exports = db;
